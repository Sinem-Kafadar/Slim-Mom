const intakeCalorie = ({
  currentWeight,
  height,
  age,
  desiredWeight,
}) => {
  const values = [
    currentWeight,
    height,
    age,
    desiredWeight,
  ];

  // Eksik veya geçersiz değer varsa hesaplama yapma.
  if (
    values.some(
      value =>
        value === '' ||
        value === null ||
        value === undefined ||
        !Number.isFinite(Number(value)) ||
        Number(value) <= 0
    )
  ) {
    return null;
  }

  const weight = Number(currentWeight);
  const heightInCm = Number(height);
  const ageInYears = Number(age);
  const targetWeight = Number(desiredWeight);

  // Slim Mom referans projesindeki kalori hesaplama formülü.
  const calories =
    10 * weight +
    6.25 * heightInCm -
    5 * ageInYears -
    161 -
    10 * (weight - targetWeight);

  return Math.round(calories);
};

export default intakeCalorie;
