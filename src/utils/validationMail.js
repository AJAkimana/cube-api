export const validationMail = (link = '') => {
  return `
  <body style="margin: 0; padding: 0;">
  <table border="0" cellpadding="0" cellspacing="0" width="900px" style="padding: 0 40px 0 40px; background-color:#f1f2f3;">
    <tr>
      <td align = "center" style="padding: 0 50px 0 50px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff; padding: 0 0 0 20px;">
          <tr>
            <td>
              [Logo]
            </td>
          </tr>
          <tr>
            <td style="padding: 0 50px 0 50px;">
             <p>
              You're well on your way to setting up your Augmented Reality Innovations
              3D + AR commerce account. We just need to verify your email. Click the
              button below to let us know know this is really you. <br>
              Oh yes, this link is valid for 24 hours.
             </p>
            </td>
          </tr>
          <tr>
            <td align="center">
              <a href="${link}">[Verify email address] <--BUTTON</a>
            </td>
          </tr>
          <tr>
            <td>
              <hr>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                If you’re having trouble with the button above, copy and paste the URL below into your 
                web browser.<br/>
                ${link}
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 30px 30px 30px 30px; color: rgb(124, 121, 121)">
              &copy; ${new Date().getFullYear()} Augmented Reality Innovations. All rights reserved.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 30px 30px 30px 30px; color: rgb(124, 121, 121)">
              Augmented Reality Innovations <br>
              80F Centurian Dr. Suite 10, Markham, ON L3R-8C1
            </td>
          </tr>
        </table>
      </td>
      </tr>
    </table>
  </body>
  `;
};
