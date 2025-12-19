import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const buyerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      unique: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    address: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },

    refreshToken: {
      type: String,
      select: false
    }
  },
  { timestamps: true }
);

/* HASH PASSWORD */
buyerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

/* COMPARE PASSWORD */
buyerSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("Buyer", buyerSchema);
