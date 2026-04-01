const userModel = require("../models/userModel"); // Path to your user model

// Helper to get user reminders
async function getUserRemindersDB(userId) {
    try {
        const user = await userModel.findOne({ id: userId }).select('reminders -_id');
        return user ? user.reminders : [];
    } catch (err) {
        console.error("Database Error fetching reminders:", err);
        throw err;
    }
}

// GET all reminders for the specific user
exports.getReminders = async (req, res) => {
    const { userId } = req.body; // Sent from frontend after token verification
    try {
        const reminders = await getUserRemindersDB(userId);
        res.json({ reminders: reminders });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch reminders" });
    }
};

// ADD a new reminder to the array
exports.addReminder = async (req, res) => {
    const { userId, reminderObj } = req.body; 
    // reminderObj should be { title, date, rawTime, displayTime }
    
    try {
        await userModel.updateOne(
            { id: userId },
            { $push: { reminders: reminderObj } }
        );
        res.json({ message: "Reminder scheduled successfully" });
    } catch (err) {
        console.error("Error adding reminder:", err);
        res.status(500).json({ message: "Failed to save reminder" });
    }
};

// DELETE a reminder
exports.deleteReminder = async (req, res) => {
    const { userId, reminderObj } = req.body;
    try {
        await userModel.updateOne(
            { id: userId },
            { $pull: { reminders: reminderObj } }
        );
        res.json({ message: "Reminder removed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete reminder" });
    }
};