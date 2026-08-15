export function jobRequestQueryError(error: string | undefined): string | null {
  if (!error) return null;
  switch (error) {
    case "invalid-auth":
      return "Enter your name, a valid email, and a 10-digit mobile number.";
    case "invalid-request":
      return "Check all fields — date of birth, education, location, experience, and your job needs are required.";
    case "invalid-otp":
      return "That code is wrong or expired. Try again or request a new code.";
    case "login-required":
      return "Sign in with your email or mobile first, then submit your job request.";
    case "phone-mismatch":
      return "This email is registered with a different mobile number. Use the same phone or contact support.";
    case "phone-taken":
      return "This mobile number is linked to another account. Sign in with that account or use a different number.";
    case "email-taken":
      return "This email belongs to an employer or admin account. Use a different email for job requests.";
    case "otp-failed":
      return "We could not send the SMS code. Try email sign-in or try again later.";
    case "rate-limited":
      return "Too many attempts. Please wait a few minutes.";
    case "email-config":
      return "Email sign-in is not configured. Try SMS code or contact support.";
    case "email-failed":
      return "We could not send the email. Try again or use SMS code.";
    case "email-rate-limited":
      return "Too many emails sent. Wait up to an hour or use SMS code.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function jobRequestQueryInfo(query: {
  auth?: string;
  success?: string;
}): string | null {
  if (query.success === "posted") {
    return "Your job request is live. Employers can see it below and contact you on WhatsApp.";
  }
  if (query.auth === "sent") {
    return "Check your email for a sign-in link (about 1 hour). Then complete your job request.";
  }
  if (query.auth === "otp-sent") {
    return "Enter the 6-digit code we sent to your mobile.";
  }
  if (query.auth === "signed-in") {
    return "You’re signed in. Fill in your job requirement below.";
  }
  return null;
}
