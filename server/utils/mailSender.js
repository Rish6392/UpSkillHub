const mailSender = async (email, title, body) => {
    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": process.env.MAIL_PASS, // Using MAIL_PASS for the Brevo API Key
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: {
                    name: "UpSkillHub || CodeHelp-by Babbar",
                    email: process.env.MAIL_USER // e.g. rishabhgzp2004@gmail.com
                },
                to: [
                    {
                        email: email
                    }
                ],
                subject: title,
                htmlContent: body
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Brevo API Error: ${JSON.stringify(errorData)}`);
        }

        const info = await response.json();
        console.log("Email sent successfully via Brevo: ", info);
        return info;
    } catch (error) {
        console.error("Error sending email: ", error.message);
        throw error;
    }
}

module.exports = mailSender;