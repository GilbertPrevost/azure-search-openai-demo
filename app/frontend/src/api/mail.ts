import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// Assuming transporter is predefined and valid
const transporter = nodemailer.createTransport({
  // transport options
  host: "techunity.com",
  port: 465,
  auth: {
    user: "ai@techunity.com",
    pass: "ambK5*G@@HJu",
  },
  secure: true,
});

const formatDateTime = () => {
  const currentDateTime = new Date();

  const formattedDate = new Intl.DateTimeFormat('en-US').format(currentDateTime);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  }).format(currentDateTime);

  return `${formattedDate} ${formattedTime}`;
};


export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { receiver, filename, pdfData } = req.body;

    const info = await transporter.sendMail({
      from: 'ai@techunity.com',
      to: receiver,
      subject: `Chat Transcript ${formatDateTime()}`,
      text: `Dear User,\n\nThank you for using our AI Chatbot.\n\nAttached is a transcript of the dialog you recently had with our AI Assistant.\n\nIf you believe any of the responses are incorrect, please send us your comments.\n\nWe look forward to engaging with you again.\n\nBest Regards\nTechUnity, Inc.\nai@techunity.com\nhttp://www.techunity.com\n\nThis email and any attachments are intended exclusively for the person or entity to which it is addressed. The information contained is proprietary, confidential, and privileged and is protected from disclosure. Dissemination, distribution, or duplication of this email or its attachments by anyone other than the intended recipient is strictly prohibited. If you are not the intended recipient, we ask that you respect the legal rights of the sender and the intended recipient by deleting the email and all attachments. If you have received this email in error, we encourage you to notify us so the situation can be rectified.`,
      attachments: [
        {
          filename,
          content: Buffer.from(pdfData, 'base64'),
        },
      ],
    });

    res.status(200).json({ messageId: info.messageId });
  } catch (error) {
    console.error("Failed to send email", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};
