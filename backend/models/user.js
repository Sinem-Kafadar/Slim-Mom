import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true,
      minlength: 2,
      maxlength: 40,
    },

    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required.'],
    },

    personalData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    dailyDiet: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Kullanıcı bilgileri döndürülürken şifreyi yanıttan çıkar.
userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    delete returnedObject.password;
    return returnedObject;
  },
});

const User = mongoose.model('user', userSchema);

export default User;
