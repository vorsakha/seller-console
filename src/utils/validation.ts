export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return "Email is required";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email address";
  }

  return null;
}

export function validateOpportunityAmount(amount: string): string | null {
  if (!amount.trim()) {
    return null;
  }

  const numericAmount = parseFloat(amount);

  if (isNaN(numericAmount)) {
    return "Please enter a valid number";
  }

  if (numericAmount < 0) {
    return "Amount must be positive";
  }

  return null;
}
