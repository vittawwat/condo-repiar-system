const express = require("express")
const router = express.Router()

const { getNotifications,
        updateNotificationStatus,
        getNotificationCount,
        approveAppointmentRequest,
        rejectedAppointmentRequest
} = require('../controllers/notificationController');

router.get('/', getNotifications);

// GET /api/notifications/count
router.get('/count', getNotificationCount);

// PATCH /api/notifications/:id
router.patch('/:id', updateNotificationStatus);

router.patch('/:request_id/approve', approveAppointmentRequest);
router.patch('/:request_id/reject', rejectedAppointmentRequest);

module.exports = router;  