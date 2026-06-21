const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;

client.authentications["api-key"].apiKey =
  process.env.BREVO_API_KEY;

const apiInstance =
  new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (
  to,
  subject,
  html
) => {
  try {
  await apiInstance.sendTransacEmail({
    sender: {
      email: "rehankhann77088@gmail.com",
      name: "BiteMeNow",
    },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  });

  console.log("Email sent successfully");
} catch (error) {
  console.log("EMAIL ERROR:", error);
}
};

module.exports = sendEmail;