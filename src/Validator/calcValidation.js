import * as Yup from 'yup';

const validationSchema = Yup.object({
  height: Yup.number()
    .typeError('Height must be a number.')
    .positive('Height must be positive.')
    .required('Height is required.'),

  age: Yup.number()
    .typeError('Age must be a number.')
    .positive('Age must be positive.')
    .integer('Age must be an integer.')
    .required('Age is required.'),

  currentWeight: Yup.number()
    .typeError('Current weight must be a number.')
    .positive('Current weight must be positive.')
    .required('Current weight is required.'),

  desiredWeight: Yup.number()
    .typeError('Desired weight must be a number.')
    .positive('Desired weight must be positive.')
    .required('Desired weight is required.'),

  bloodType: Yup.number()
    .typeError('Blood type must be selected.')
    .oneOf(
      [1, 2, 3, 4],
      'Please select a valid blood type.'
    )
    .required('Blood type is required.'),
});

export default validationSchema;
