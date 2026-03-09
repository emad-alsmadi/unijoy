const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');
const { validationResult } = require('express-validator');
const { checkReservationConflict } = require('../util/conflictChecker');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Stripe secret key

const Event = require('../models/event');
const User = require('../models/user');
const Hall = require('../models/hall');
const HallReservation = require('../models/hallReservation');
const Payment = require('../models/payment');

exports.getHostEvents = (req, res, next) => {
  if (req.userRole !== 'host') {
    const error = new Error(
      'Not authorized. Only hosts can view their events.'
    );
    error.statusCode = 403;
    return next(error);
  }

  const currentPage = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 2;
  const filterType = req.query.type; // "upcoming", "past", or undefined
  const now = new Date();

  // Base filter: events by this host
  let filter = { host: req.userId };

  // Add date filter based on type
  if (filterType === 'upcoming') {
    filter.endDate = { $gte: now };
  } else if (filterType === 'past') {
    filter.endDate = { $lt: now };
  }

  let totalItems;

  Event.find(filter)
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Event.find(filter)
        .populate('hall', 'name location capacity')
        .populate('category', 'name')
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((events) => {
      res.status(200).json({
        message: 'Fetched events successfully',
        events: events,
        totalItems: totalItems,
        currentPage: currentPage,
        totalPages: Math.ceil(totalItems / perPage),
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

const ImageUploadService = require('../services/imageUploadService');

exports.createEvent = (req, res, next) => {
  console.log('Boday =>>>>>>>>>>', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Valdation failed, Entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }

  // Handle image upload or URL
  let imageUrlPromise;

  if (req.file) {
    // Convert uploaded file to base64 and upload to external service
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    imageUrlPromise = ImageUploadService.uploadImage(base64Image);
  } else if (req.body.imageUrl) {
    // Use provided URL directly
    imageUrlPromise = Promise.resolve({
      success: true,
      url: req.body.imageUrl,
    });
  } else {
    // Use default image
    imageUrlPromise = Promise.resolve({
      success: true,
      url: ImageUploadService.getDefaultImageUrl(),
      isDefault: true,
    });
  }

  imageUrlPromise
    .then((imageResult) => {
      if (!imageResult.success) {
        const error = new Error('Failed to upload image: ' + imageResult.error);
        error.statusCode = 422;
        throw error;
      }

      const imageUrl = imageResult.url;
      const title = req.body.title;
      const description = req.body.description;
      const date = req.body.date;
      const startDate = req.body.startDate;
      const endDate = req.body.endDate;
      const time = req.body.time;
      const capacity = req.body.capacity;
      let price = req.body.price || 0.0;
      const location = req.body.location;
      const hall = req.body.hall;
      const category = req.body.category;

      const host = req.userId;
      return User.findById(host).then((user) => {
        if (!user || (user.role !== 'host' && user.role !== 'admin')) {
          const error = new Error(
            'Not authorized. Only hosts or admins can create events.'
          );
          error.statusCode = 403;
          throw error;
        }

        // If hall specified, check if there is any approved event conflicting for the same hall/time
        if (hall) {
          return Event.findOne({
            hall: hall,
            status: 'approved',
            $or: [
              {
                startDate: {
                  $lt: new Date(endDate),
                  $gte: new Date(startDate),
                },
              },
              {
                endDate: { $gt: new Date(startDate), $lte: new Date(endDate) },
              },
              {
                startDate: { $lte: new Date(startDate) },
                endDate: { $gte: new Date(endDate) },
              },
            ],
          })
            .then((conflictEvent) => {
              if (conflictEvent) {
                const error = new Error(
                  'This hall is already reserved for the selected time period.'
                );
                error.statusCode = 409;
                throw error;
              }
              return true;
            })
            .then(() => {
              const event = new Event({
                title: title,
                description: description,
                date: date,
                startDate: startDate,
                endDate: endDate,
                time: time,
                image: imageUrl,
                capacity: capacity,
                price: price,
                location: location,
                host: host,
                hall: hall || null, // only set if present
                category: category,
                status: 'pending',
              });

              return event.save();
            });
        } else {
          // No hall specified
          const event = new Event({
            title: title,
            description: description,
            date: date,
            startDate: startDate,
            endDate: endDate,
            time: time,
            image: imageUrl,
            capacity: capacity,
            price: price,
            location: location,
            host: host,
            hall: null,
            category: category,
            status: 'pending',
          });

          return event.save();
        }
      });
    })
    .then((event) => {
      // Hall is NOT reserved on creation — reservation happens on admin approval
      // So just return the saved event
      res.status(201).json({
        message: 'Event created successfully! Pending admin approval.',
        event: event,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getHostEvent = (req, res, next) => {
  const eventId = req.params.eventId;

  Event.findById(eventId)
    .populate('hall', 'name location capacity')
    .populate('category', 'name')
    .then((event) => {
      if (!event) {
        const error = new Error('Could not find event');
        error.statusCode = 404;
        throw error;
      }

      if (req.userRole !== 'admin' && event.host.toString() !== req.userId) {
        const error = new Error('Not authorized to access this event');
        error.statusCode = 403;
        throw error;
      }

      res.status(200).json({ message: 'Event fetched!', event: event });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateEvent = (req, res, next) => {
  const eventId = req.params.eventId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect');
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const description = req.body.description;
  const date = req.body.date;
  const time = req.body.time;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const capacity = req.body.capacity;
  const location = req.body.location;
  const price = req.body.price;
  const hall = req.body.hall;
  const category = req.body.category;
  const imageUrl = req.body.imageUrl || eventDoc.image; // Use new URL or keep existing

  let eventDoc;
  Event.findById(eventId)
    .then((event) => {
      if (!event) {
        const error = new Error('Could not find event');
        error.statusCode = 404;
        throw error;
      }
      if (!imageUrl && !event.image) {
        const error = new Error('No image URL provided');
        error.statusCode = 422;
        throw error;
      }

      // Role check: must be host or admin
      if (event.host.toString() !== req.userId && req.userRole !== 'admin') {
        const error = new Error('Not authorized to update this event.');
        error.statusCode = 403;
        throw error;
      }
      eventDoc = event;
      // Check if hall or time changed, then check for conflicts
      const hallChanged =
        hall && (!event.hall || event.hall.toString() !== hall.toString());
      const startDateChanged =
        req.body.startDate &&
        new Date(req.body.startDate).getTime() !== event.startDate.getTime();
      const endDateChanged =
        req.body.endDate &&
        new Date(req.body.endDate).getTime() !== event.endDate.getTime();

      if (hallChanged || startDateChanged || endDateChanged) {
        // Check for reservation conflict excluding current event reservation
        return checkReservationConflict(
          hall,
          new Date(req.body.startDate),
          new Date(req.body.endDate),
          event._id //exclude current event from check
        ).then((conflict) => {
          if (conflict) {
            const error = new Error(
              'Hall is already reserved for the selected time.'
            );
            error.statusCode = 409;
            throw error;
          }
          return true;
        });
      }
      return true;
    })
    .then(() => {
      // Update image if changed
      if (imageUrl && imageUrl !== eventDoc.image) {
        eventDoc.image = imageUrl;
      }
      // Update fields
      eventDoc.title = title;
      eventDoc.description = description;
      eventDoc.date = new Date(date);
      eventDoc.time = time;
      eventDoc.capacity = capacity;
      eventDoc.location = location;
      eventDoc.price = price || 0;
      eventDoc.category = category;

      // If hall or time changed and event was approved, revert to pending and delete previous reservation
      const hallChanged =
        hall &&
        (!eventDoc.hall || eventDoc.hall.toString() !== hall.toString());
      const startDateChanged =
        req.body.startDate &&
        new Date(req.body.startDate).getTime() !== eventDoc.startDate.getTime();
      const endDateChanged =
        req.body.endDate &&
        new Date(req.body.endDate).getTime() !== eventDoc.endDate.getTime();

      // If hall/time changed and event was approved, mark as pending and delete reservation
      if (hallChanged || startDateChanged || endDateChanged) {
        if (eventDoc.status === 'approved') {
          eventDoc.status = 'pending'; // Revert for re-approval
          // Remove previous hall reservation if exists
          return HallReservation.findOneAndDelete({ event: eventDoc._id })
            .then(() => {
              // Only free old hall if no other reservation exists for it
              if (eventDoc.hall) {
                return HallReservation.findOne({
                  hall: eventDoc.hall,
                  status: 'reserved',
                  event: { $ne: eventDoc._id },
                }).then((otherReservation) => {
                  if (!otherReservation) {
                    return Hall.findById(eventDoc.hall).then((oldHall) => {
                      if (oldHall) {
                        oldHall.status = 'available';
                        return oldHall.save();
                      }
                    });
                  }
                });
              }
            })
            .then(() => {
              // Update hall and reservation dates
              eventDoc.hall = hall || null;
              eventDoc.startDate = new Date(startDate);
              eventDoc.endDate = new Date(endDate);
              return eventDoc.save();
            });
        } else {
          // Not approved: just update hall and dates
          eventDoc.hall = hall || null;
          eventDoc.startDate = new Date(startDate);
          eventDoc.endDate = new Date(endDate);
          return eventDoc.save();
        }
      }

      // No hall/date/time change: just save
      return eventDoc.save();
    })
    .then((result) => {
      res.status(200).json({
        message: 'Event updated successfully.',
        event: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.deleteEvent = (req, res, next) => {
  const eventId = req.params.eventId;

  let eventDoc;
  Event.findById(eventId)
    .then((event) => {
      if (!event) {
        const error = new Error('Could not find event!');
        error.statusCode = 404;
        throw error;
      }
      if (event.host.toString() !== req.userId && req.userRole !== 'admin') {
        const error = new Error('Not authorized to delete this event.');
        error.statusCode = 403;
        throw error;
      }
      eventDoc = event;

      // Refund payments if event is paid
      if (event.price > 0) {
        return Payment.find({ event: eventId, status: 'completed' }).then(
          (payments) => {
            const refundPromises = payments.map((payment) => {
              if (!payment.stripePaymentIntentId) {
                // Skip if no PaymentIntent ID
                return Promise.resolve();
              }
              return stripe.refunds
                .create({
                  payment_intent: payment.stripePaymentIntentId,
                  amount: payment.amount * 100, // multiply by 100 to convert dollars to cents
                })
                .then(() => {
                  // Update payment status to refunded in DB
                  payment.status = 'refunded';
                  return payment.save();
                });
            });
            return Promise.all(refundPromises);
          }
        );
      }
      // If not paid, just resolve immediately
      return Promise.resolve();
    })
    .then(() => {
      // Delete associated hall reservation if it exists
      return HallReservation.findOneAndDelete({ event: eventDoc._id });
    })
    .then((reservation) => {
      if (reservation) {
        return HallReservation.find({
          hall: reservation.hall,
          status: 'reserved',
          event: { $ne: reservation.event },
        }).then((otherReservations) => {
          if (otherReservations.length === 0) {
            // No other reservations exist, free the hall
            return Hall.findById(reservation.hall).then((hall) => {
              if (hall) {
                hall.status = 'available';
                return hall.save();
              }
            });
          }
          // Other reservations exist, do not free hall
          return Promise.resolve();
        });
      }
    })
    .then(() => {
      // No need to clear image since we're using URLs
      return Event.findByIdAndDelete(eventId);
    })
    .then(() => {
      res.status(200).json({ message: 'Event deleted successfully.' });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.getAllApprovedEvents = (req, res, next) => {
  const currentPage = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const filterType = req.query.type; // "upcoming", "past", or undefined
  const now = new Date();

  // Base filter: only approved events
  let filter = { status: 'approved' };

  // Add date filter based on type
  if (filterType === 'upcoming') {
    filter.endDate = { $gte: now };
  } else if (filterType === 'past') {
    filter.endDate = { $lt: now };
  }

  let totalItems;

  Event.find(filter)
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Event.find(filter)
        .populate('hall', 'name location capacity')
        .populate('category', 'name')
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((events) => {
      res.status(200).json({
        message: 'Fetched public events successfully',
        events: events,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.getSingleApprovedEvent = (req, res, next) => {
  const eventId = req.params.eventId;

  Event.findOne({ _id: eventId, status: 'approved' })
    .populate('hall', 'name location capacity')
    .populate('category', 'name')
    .then((event) => {
      if (!event) {
        const error = new Error('Event not found or not approved');
        error.statusCode = 404;
        throw error;
      }
      res
        .status(200)
        .json({ message: 'Event fetched successfully', event: event });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.getAllEvents = (req, res, next) => {
  if (req.userRole !== 'admin') {
    const error = new Error('Not authorized. Only admins can view all events.');
    error.statusCode = 403;
    return next(error);
  }

  const currentPage = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const filterType = req.query.type; // "upcoming", "past", or undefined
  const now = new Date();

  // Base filter
  let filter = {};

  // Add date filter based on type
  if (filterType === 'upcoming') {
    filter.endDate = { $gte: now };
  } else if (filterType === 'past') {
    filter.endDate = { $lt: now };
  }

  let totalItems;

  Event.find(filter)
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Event.find(filter)
        .populate('hall', 'name location capacity')
        .populate('category', 'name')
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((events) => {
      res.status(200).json({
        message: 'Fetched events successfully',
        events: events,
        totalItems: totalItems,
        currentPage: currentPage,
        totalPages: Math.ceil(totalItems / perPage),
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.getSingleEvent = (req, res, next) => {
  if (req.userRole !== 'admin') {
    const error = new Error(
      'Not authorized. Only admins can view event details.'
    );
    error.statusCode = 403;
    return next(error);
  }

  const eventId = req.params.eventId;

  Event.findById(eventId)
    .populate('hall', 'name location capacity')
    .populate('category', 'name')
    .then((event) => {
      if (!event) {
        const error = new Error('Event not found');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Event fetched successfully', event });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

exports.getInvoice = (req, res, next) => {
  const eventId = req.params.eventId;
  const userId = req.userId;
  const userRole = req.userRole;

  if (userRole !== 'user') {
    const error = new Error(
      'Only users can generate invoices for event registrations.'
    );
    error.statusCode = 403;
    return next(error);
  }

  Event.findOne({ _id: eventId, status: 'approved' })
    .populate({
      path: 'host',
      select: 'name email role hostCategory',
      populate: {
        path: 'hostCategory',
        select: 'name',
      },
    })
    .then((event) => {
      if (!event) {
        const error = new Error('Event not found or not approved.');
        error.statusCode = 404;
        throw error;
      }

      // Check if user is registered for this event
      const isRegistered = event.registeredUsers?.includes(userId);
      if (!isRegistered) {
        const error = new Error('You are not registered for this event.');
        error.statusCode = 403;
        throw error;
      }

      // If price is free (0, undefined, or null)
      if (!event.price || event.price === 0) {
        const error = new Error('This is a free event. No invoice available.');
        error.statusCode = 400;
        throw error;
      }

      // Find the corresponding payment
      return Payment.findOne({
        user: userId,
        event: eventId,
        status: 'completed',
      }).then((payment) => {
        if (!payment) {
          const error = new Error('Payment not found.');
          error.statusCode = 404;
          throw error;
        }
        // Generate PDF invoice
        const invoiceName = `invoice-${eventId}-${userId}.pdf`;
        const invoicePath = path.join('data', 'invoices', invoiceName);

        const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          `inline; filename="${invoiceName}"`
        );

        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);

        pdfDoc.fontSize(20).text('Event Invoice', { underline: true });
        pdfDoc.moveDown();

        // Event Info
        pdfDoc.fontSize(14).text(`Event: ${event.title}`);
        pdfDoc.text(`Date: ${new Date(event.date).toLocaleString()}`);
        pdfDoc.text(`Price: $${(event.price / 100).toFixed(2)}`);
        pdfDoc.moveDown();

        // Host/Admin Info
        if (event.host) {
          pdfDoc.text(`Created By: ${event.host.name}`);
          pdfDoc.text(`Email: ${event.host.email}`);
          pdfDoc.text(`Role: ${event.host.role}`);

          if (
            event.host.role === 'host' &&
            event.host.hostCategory &&
            event.host.hostCategory.name
          ) {
            pdfDoc.text(`Organization: ${event.host.hostCategory.name}`);
          }

          pdfDoc.moveDown();
        }

        // Payment Info
        pdfDoc.text(`Payment ID: ${payment._id}`);
        pdfDoc.text(`Stripe Payment Intent: ${payment.stripePaymentIntentId}`);
        pdfDoc.text(`Amount Paid: $${(payment.amount / 100).toFixed(2)}`);
        pdfDoc.text(`Status: ${payment.status}`);
        pdfDoc.text(`Date: ${new Date(payment.createdAt).toLocaleString()}`);

        pdfDoc.end();
      });
    })
    .catch((err) => {
      if (!err.statusCode) err.statusCode = 500;
      next(err);
    });
};

// Helper function to provide default image URLs based on category or random selection
const getDefaultImageUrl = () => {
  const defaultImages = [
    'https://images.unsplash.com/photo-1492684228672-755b87908021?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1479222724629-152724b6e765?w=800&h=600&fit=crop',
  ];
  return defaultImages[Math.floor(Math.random() * defaultImages.length)];
};

// Clear image function is no longer needed since we use URLs
// const clearImage = (filePath) => {
//   filePath = path.join(__dirname, '..', filePath);
//   fs.unlink(filePath, (err) => {
//     console.log(err);
//   });
// };
