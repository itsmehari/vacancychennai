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
      return "Your email is not verified yet. Open the link we sent to your inbox to finish signing in.";
    case "invalid-token":
      return "This sign-in or verification link is invalid or has expired. Request a new one from the login page.";
    case "email-config":
      return "Sign-in email is not configured on this server. Ask the site admin to set RESEND_API_KEY, RESEND_FROM, and NEXT_PUBLIC_SITE_URL.";
    case "email-failed":
      return "We could not send the email. Try again in a moment or contact support if it continues.";
    case "email-rate-limited":
      return "Too many emails sent to this address. Please wait up to an hour before trying again.";
    case "email-taken":
      return "An account already exists with this email. Try signing in or use a different address.";
    case "weak-password":
      return "Use a password with at least 8 characters.";
    case "password-mismatch":
      return "Passwords do not match.";
    case "invalid-phone":
      return "Enter a valid phone number (10+ digits, optional country code).";
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
    return "If an account exists for that email, we sent password reset instructions. Check your inbox (and spam).";
  }
  if (query.registered === "1") {
    return "Account created. Check your email to verify your address, then sign in.";
  }
  if (query.reset === "1") {
    return "Password updated. Sign in with your new password.";
  }
  if (query.subscribed === "1") {
    return "You’re subscribed. We’ll use this to send updates when we add that channel.";
  }
  if (query.sent === "1") {
    return "If this email is registered, we sent a sign-in link. Check your inbox (and spam) — it expires in about an hour.";
  }
  if (query.resent === "1") {
    return "If this address has an unverified employer account, we sent another verification email.";
  }
  return null;
}
