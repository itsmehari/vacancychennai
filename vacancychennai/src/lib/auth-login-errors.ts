export function loginQueryErrorMessage(error: string | undefined): string | null {
  if (!error) return null;
  switch (error) {
    case "rate-limited":
      return "Too many sign-in attempts. Please wait a few minutes, then try again.";
    case "invalid":
      return "Invalid email or password. Check your details and try again.";
    case "invalid-candidate":
      return "We could not find a candidate account for that email. Use the same address you apply with, or browse jobs to get started.";
    case "unverified":
      return "Sign in with your email and password. No verification email is required.";
    case "invalid-token":
      return "This link is invalid or has expired. Sign in with your password.";
    case "email-config":
    case "email-failed":
    case "email-sandbox":
      return "Sign in with your email and password. This site does not send sign-in email.";
    case "no-password":
      return "This account has no password yet. Set one below. If no mobile is saved yet, the number you enter is stored on the account.";
    case "no-phone":
      return "Add the mobile number for this account in the form below, then choose a password.";
    case "phone-mismatch":
      return "That mobile number does not match this account.";
    case "email-rate-limited":
      return "Please wait a few minutes, then try again.";
    case "email-taken":
      return "An account already exists with this email. Try signing in or use a different address.";
    case "weak-password":
      return "Use a password with at least 8 characters.";
    case "password-mismatch":
      return "Passwords do not match.";
    case "invalid-phone":
      return "Enter a valid phone number (10 digits, or include the country code).";
    case "invalid-education":
      return "Choose your educational qualification.";
    case "invalid-preferences":
      return "Choose at least one kind of work you want.";
    case "invalid-location":
      return "Choose an area from the list.";
    case "phone-taken":
      return "That mobile number is already on another account. Sign in with the email you used, or use a different number.";
    case "db-required":
      return "Registration and subscriptions require the live database. Try again later or contact support.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function loginQueryInfoMessage(query: {
  sent?: string;
  resent?: string;
  registered?: string;
  reset?: string;
  forgot?: string;
  subscribed?: string;
}): string | null {
  if (query.forgot === "1") {
    return "Password reset by email is off. Sign in with your password, or write to support@vacancychennai.in.";
  }
  if (query.registered === "1") {
    return "Account created. Sign in with the password you chose.";
  }
  if (query.reset === "1") {
    return "Password updated. Sign in with your new password.";
  }
  if (query.subscribed === "1") {
    return "You’re subscribed. We’ll use this to send updates when we add that channel.";
  }
  if (query.sent === "1" || query.resent === "1") {
    return "Sign in with your email and password.";
  }
  return null;
}
