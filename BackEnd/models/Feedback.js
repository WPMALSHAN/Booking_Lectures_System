import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: {
      type: String,
      required: true,
      minlength: [20, "Comment must be at least 20 characters"],
      maxlength: [70, "Comment cannot exceed 70 characters"],
      validate: {
        validator: function (v) {
          // Only letters and spaces allowed
          return /^[A-Za-z\s]+$/.test(v);
        },
        message: props => `${props.value} contains invalid characters. Only letters and spaces are allowed.`,
      },
    },
  },
  { timestamps: true },
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;