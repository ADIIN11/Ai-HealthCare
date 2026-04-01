const express =require ("express")
const router = express.Router()

const calendarController = require('../controllers/calendarController');
const path = require('path')



router.get("/",(req, res) => {
  res.sendFile(path.join(__dirname, "../public/calendar.html"))
})


router.post('/Get-Reminders', calendarController.getReminders);
router.post('/Add-Reminder', calendarController.addReminder);
router.post('/Delete-Reminder', calendarController.deleteReminder);

module.exports = router;