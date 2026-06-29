// This is a utility file, not a component. You can import and call it anywhere.
// For hiring acceptance or payment success, call this function.
export function sendDummyEmail(to, subject, body) {
  console.log(`[DUMMY EMAIL] To: ${to}`);
  console.log(`[DUMMY EMAIL] Subject: ${subject}`);
  console.log(`[DUMMY EMAIL] Body: ${body}`);
  // You can also show a toast for simulation
  import('react-hot-toast').then(({ default: toast }) => {
    toast.success(`Dummy email sent to ${to}`);
  });
}