function emailVerificationHTML(email, verificationCode) {
    return `
    <table border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
    <tbody>
        <tr>
            <td height="20" style="line-height:20px" colspan="3">&nbsp;</td>
        </tr>
        <tr>
            <td height="1" colspan="3" style="line-height:1px"></td>
        </tr>
        <tr>
            <td>
                <table border="0" width="100%" cellspacing="0" cellpadding="0"
                    style="border-collapse:collapse;text-align:center;width:100%">
                    <tbody>
                        <tr>
                            <td width="15px" style="width:15px"></td>
                            <td style="line-height:0px;max-width:600px;padding:0 0 15px 0">
                                <table border="0" width="100%" cellspacing="0" cellpadding="0"
                                    style="border-collapse:collapse">
                                    <tbody>
                                        <tr>
                                            <td style="width:100%;text-align:left;height:33px"><img height="33"
                                                    src="https://ci3.googleusercontent.com/meips/ADKq_NZOuwWow1hequUmkYlojOB8b7wBf6eSVAJaMxSRSRbOK-m43XIVYFgsxdp06-1V6TG1kn-vCSX0fIByOKeu2ekAw5B_GWA6pO79NqE0KGuXp7w=s0-d-e1-ft#https://static.xx.fbcdn.net/rsrc.php/v3/yO/r/Otjcwa2eCOF.png"
                                                    style="border:0" class="CToWUd" data-bit="iit"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td width="15px" style="width:15px"></td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table border="0" width="430" cellspacing="0" cellpadding="0"
                    style="border-collapse:collapse;margin:0 auto 0 auto">
                    <tbody>
                        <tr>
                            <td>
                                <table border="0" width="430px" cellspacing="0" cellpadding="0"
                                    style="border-collapse:collapse;margin:0 auto 0 auto;width:430px">
                                    <tbody>
                                        <tr>
                                            <td width="15" style="display:block;width:15px">&nbsp;&nbsp;&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td width="12" style="display:block;width:12px">&nbsp;&nbsp;&nbsp;</td>
                                            <td>
                                                <table border="0" width="100%" cellspacing="0" cellpadding="0"
                                                    style="border-collapse:collapse">
                                                    <tbody>
                                                        <tr>
                                                            <td></td>
                                                            <td
                                                                style="margin:10px 0 10px 0;color:#565a5c;font-size:18px">
                                                                <p
                                                                    style="margin:10px 0 10px 0;color:#565a5c;font-size:18px">
                                                                    Hi,</p>
                                                                <p
                                                                    style="margin:10px 0 10px 0;color:#565a5c;font-size:18px">
                                                                    Someone tried to sign up for an Instagram account
                                                                    with <a href="mailto:${email}"
                                                                        target="_blank">${email}</a>. If it
                                                                    was you, enter this confirmation code in the app:
                                                                </p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td></td>
                                                            <td
                                                                style="padding:10px;color:#565a5c;font-size:32px;font-weight:500;text-align:center;padding-bottom:25px">
                                                                ${verificationCode}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table border="0" cellspacing="0" cellpadding="0"
                    style="border-collapse:collapse;margin:0 auto 0 auto;width:100%;max-width:600px">
                    <tbody>
                        <tr>
                            <td height="4" style="line-height:4px" colspan="3">&nbsp;</td>
                        </tr>
                        <tr>
                            <td width="15px" style="width:15px"></td>
                            <td width="20" style="display:block;width:20px">&nbsp;&nbsp;&nbsp;</td>
                            <td style="text-align:center">
                                <div style="padding-top:10px;display:flex">
                                    <div style="margin:auto"><img
                                            src="https://ci3.googleusercontent.com/meips/ADKq_NZ2ivJHkv1KH9YS4Yecj8l99ueLszgAkXVAp0N50dD4Ymu0h1h6mxYcBJPC_sK-e9dLWuH1g-vgF844MKpudUUCekQ6pdY1QLsHcrt36zAkxpk=s0-d-e1-ft#https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/Bqo9-L659wB.png"
                                            height="26" width="52" alt="" class="CToWUd" data-bit="iit"></div><br>
                                </div>
                                <div style="height:10px"></div>
                                <div style="color:#abadae;font-size:11px;margin:0 auto 5px auto">© Instagram. Meta
                                    Platforms, Inc., 1601 Willow Road, Menlo Park, CA 94025<br></div>
                                <div style="color:#abadae;font-size:11px;margin:0 auto 5px auto">This message was sent
                                    to <a style="color:#abadae;text-decoration:underline">${email}</a>.<br>
                                </div>
                            </td>
                            <td width="20" style="display:block;width:20px">&nbsp;&nbsp;&nbsp;</td>
                            <td width="15px" style="width:15px"></td>
                        </tr>
                        <tr>
                            <td height="32" style="line-height:32px" colspan="3">&nbsp;</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td height="20" style="line-height:20px" colspan="3">&nbsp;</td>
        </tr>
    </tbody>
</table>
    `;
}



const forgotPasswordHtml = (username, token) => {

    return `
    

    <table border="0" cellspacing="0" cellpadding="0" align="center" id="m_6085750308922747705email_table" style="border-collapse:collapse"><tbody><tr><td id="m_6085750308922747705email_content" style="font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;background:#ffffff">
    <table border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
    <tbody>
    <tr>
    <td height="20" style="line-height:20px" colspan="3">&nbsp;</td>
    </tr>
    <tr>
    <td height="1" colspan="3" style="line-height:1px"></td>
    </tr>
    <tr>
    <td><table border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;text-align:center;width:100%">
    <tbody>
    <tr>
    <td width="15px" style="width:15px"></td>
    <td style="line-height:0px;max-width:600px;padding:0 0 15px 0">
    <table border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
    <tbody>
    <tr>
    <td style="width:100%;text-align:left;height:33px">
    <img height="33" src="https://ci3.googleusercontent.com/meips/ADKq_NZOuwWow1hequUmkYlojOB8b7wBf6eSVAJaMxSRSRbOK-m43XIVYFgsxdp06-1V6TG1kn-vCSX0fIByOKeu2ekAw5B_GWA6pO79NqE0KGuXp7w=s0-d-e1-ft#https://static.xx.fbcdn.net/rsrc.php/v3/yO/r/Otjcwa2eCOF.png" style="border:0" class="CToWUd" data-bit="iit">
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    <td width="15px" style="width:15px"></td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="430" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 auto 0 auto">
    <tbody>
    <tr>
    <td>
    <table border="0" width="430px" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 auto 0 auto;width:430px">
    <tbody>
    <tr>
    <td width="20" style="display:block;width:20px">
    &nbsp;&nbsp;&nbsp;
    </td>
    <td>
    <p style="margin:10px 0 10px 0;color:#565a5c;font-size:18px">Hi ${username},</p>
    <p style="margin:10px 0 10px 0;color:#565a5c;font-size:18px">Sorry to hear you’re having trouble logging into Instagram. We got a message that you forgot your password. If this was you, you can get right back into your account or reset your password now.
    </p>
    </td>
    </tr>
    <tr>
    <td height="20" style="line-height:20px">&nbsp;</td></tr><tr><td width="20" style="display:block;width:20px">&nbsp;&nbsp;&nbsp;</td>
    <td>
    <a href="http://${process.env.FRONTEND}/web_emaillogin?token=${token}&amp;auto_send=0" style="color:#1b74e4;text-decoration:none;display:block;width:370px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://${process.env.FRONTEND}/web_emaillogin?token%3DCmVTO4%26auto_send%3D0&amp;source=gmail&amp;ust=1725001664732000&amp;usg=AOvVaw3ZdpLomNr7ZNO8MlixnD1r">
    <table border="0" width="390" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
    <tbody>
    <tr>
    <td style="border-collapse:collapse;border-radius:3px;text-align:center;display:block;border:solid 1px #009fdf;padding:10px 16px 14px 16px;margin:0 2px 0 auto;min-width:80px;background-color:#47a2ea">
    <a href="https://${process.env.FRONTEND}/web_emaillogin?token=${token};auto_send=0" style="color:#1b74e4;text-decoration:none;display:block" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://${process.env.FRONTEND}/web_emaillogin?token%3DCmVTO4%26auto_send%3D0&amp;source=gmail&amp;ust=1725001664732000&amp;usg=AOvVaw3ZdpLomNr7ZNO8MlixnD1r">
    <center>
    <font size="3"><span style="font-family:Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;white-space:nowrap;font-weight:bold;vertical-align:middle;color:#fdfdfd;font-size:16px;line-height:16px">
    Log&nbsp;in&nbsp;as&nbsp;${username}
    </span>
    </font>
    </center>
    </a>
    </td>
    </tr>
    </tbody>
    </table>
    </a>
    </td>
    </tr>
    <tr>
    <td width="20" style="display:block;width:20px">&nbsp;&nbsp;&nbsp;
    </td>
    <td>
    <table border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
    <tbody>
    <tr>
    <td>
    <table border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
    <tbody>
    <tr>
    <td>
    <table border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
    <tbody>
    <tr>
    </tr>
    <tr>
    <td height="20" style="line-height:20px">&nbsp;</td>
    </tr>
    <tr>
    <td>
    <a href="https://${process.env.FRONTEND}/accounts/password/reset/confirm/?token=${token}:one_click_login_email&amp;s=one_click_login_email&amp;is_caa=0&amp;afv=LEGACY_FLOW" style="color:#1b74e4;text-decoration:none;display:block;width:370px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://${process.env.FRONTEND}/accounts/password/reset/confirm/?token=${token}:one_click_login_email%26s%3Done_click_login_email%26is_caa%3D0%26afv%3DLEGACY_FLOW&amp;source=gmail&amp;ust=1725001664732000&amp;usg=AOvVaw3trF8DJSwQWCmLK7NQomPM">
    <table border="0" width="390" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
    <tbody>
    <tr>
    <td style="border-collapse:collapse;border-radius:3px;text-align:center;display:block;border:solid 1px #009fdf;padding:10px 16px 14px 16px;margin:0 2px 0 auto;min-width:80px;background-color:#47a2ea">
    <a href="https://${process.env.FRONTEND}/accounts/password/reset/confirm/?token=${token}:one_click_login_email&amp;s=one_click_login_email&amp;is_caa=0&amp;afv=LEGACY_FLOW" style="color:#1b74e4;text-decoration:none;display:block" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://instagram.com/accounts/password/reset/confirm/?uidb36%3Dopmqz6b%26token%3D10OxpkIQmKKJTc50Nmv86k4Bd5mqLHuFJadOdhCjUqWFOhM32BWb1DJebXxT8uCd:one_click_login_email%26s%3Done_click_login_email%26is_caa%3D0%26afv%3DLEGACY_FLOW&amp;source=gmail&amp;ust=1725001664732000&amp;usg=AOvVaw3trF8DJSwQWCmLK7NQomPM">
    <center>
    <font size="3">
    <span style="font-family:Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;white-space:nowrap;font-weight:bold;vertical-align:middle;color:#fdfdfd;font-size:16px;line-height:16px">Reset&nbsp;your&nbsp;password</span>
    </font>
    </center>
    </a>
    </td>
    </tr>
    </tbody>
    </table>
    </a>
    </td>
    </tr>
    <tr>
    <td height="20" style="line-height:20px">&nbsp;</td>
    </tr>
    <tr>
    <td width="15" style="display:block;width:15px">&nbsp;&nbsp;&nbsp;</td>
    </tr>
    <tr>
    </tr>
    <tr>
    <td>
    <div>
    <div style="padding:0;margin:10px 0 10px 0;color:#565a5c;font-size:16px">If you didn’t request a login link or a password reset, you can ignore this message and <a href="https://help.instagram.com/231141655544451" style="color:#1b74e4;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://help.instagram.com/231141655544451&amp;source=gmail&amp;ust=1725001664732000&amp;usg=AOvVaw1daJ6j1S9kK6pRhNfZPl6l">learn more about why you may have received it</a>. 
    <span>
    </span>
    <br>
    <br>Only people who know your Instagram password or click the login link in this email can log into your account.</div>
    </div>
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    <td width="20" style="display:block;width:20px">&nbsp;&nbsp;&nbsp;</td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 auto 0 auto;width:100%;max-width:600px">
    <tbody>
    <tr>
    <td height="4" style="line-height:4px" colspan="3">&nbsp;</td></tr><tr><td width="15px" style="width:15px"></td><td width="20" style="display:block;width:20px">&nbsp;&nbsp;&nbsp;</td><td style="text-align:center">
    <div style="padding-top:10px;display:flex"><div style="margin:auto"><img src="https://ci3.googleusercontent.com/meips/ADKq_NZ2ivJHkv1KH9YS4Yecj8l99ueLszgAkXVAp0N50dD4Ymu0h1h6mxYcBJPC_sK-e9dLWuH1g-vgF844MKpudUUCekQ6pdY1QLsHcrt36zAkxpk=s0-d-e1-ft#https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/Bqo9-L659wB.png" height="26" width="52" alt="" class="CToWUd" data-bit="iit">
    </div>
    <br>
    </div>
    <div style="height:10px"></div><div style="color:#abadae;font-size:11px;margin:0 auto 5px auto">© Instagram. Meta Platforms, Inc., 1601 Willow Road, Menlo Park, CA 94025<br>
    </div>
    <div style="color:#abadae;font-size:11px;margin:0 auto 5px auto">This message was sent to 
    <a style="color:#abadae;text-decoration:underline">mdjavedshekh12@gmail.com</a>
     and intended for javedshekh6943. Not your account?
      <a href="https://instagram.com/accounts/remove/revoke_wrong_email/?uidb36=opmqz6b&amp;token=6o0-b01e10986ab934702854f40ec3ac17f5&amp;nonce=CB1kaWiI&amp;encoded_email=bWRqYXZlZHNoZWtoMTJAZ21haWwuY29t" style="color:#abadae;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://instagram.com/accounts/remove/revoke_wrong_email/?uidb36%3Dopmqz6b%26token%3D6o0-b01e10986ab934702854f40ec3ac17f5%26nonce%3DCB1kaWiI%26encoded_email%3DbWRqYXZlZHNoZWtoMTJAZ21haWwuY29t&amp;source=gmail&amp;ust=1725001664732000&amp;usg=AOvVaw2xAMFGxL8-5jb17fJxfu9C">Remove your email</a> from this account.<br>
      </div>
      </td>
      <td width="20" style="display:block;width:20px">&nbsp;&nbsp;&nbsp;</td><td width="15px" style="width:15px">
      </td>
      </tr>
      <tr>
      <td height="32" style="line-height:32px" colspan="3">&nbsp;</td>
      </tr>
      </tbody>
      </table>










      </td>
      </tr>
      <tr>
      <td height="20" style="line-height:20px" colspan="3">&nbsp;</td>
      </tr>
      </tbody>
      </table>
      <span><img src="https://ci3.googleusercontent.com/meips/ADKq_NYk-b6xQhqFCsnGWyZkIIoZoDl0Vb7UCV_TOGw8fuR9PjKyLkqX09L0e8T73jbGVUM6DeyK__kQppdROs_d5RHE-V4h7AXKDaudMCbnbx99VcGHdX0T2WgQR0VlUQtXFDT1ZmGtA-qAxzH9ozO5masSdunJjYzNTQ=s0-d-e1-ft#https://www.facebook.com/email_open_log_pic.php?mid=620b9adc47080G24bc396144ce93G620b9f75a7353G3df" style="border:0;width:1px;height:1px" class="CToWUd" data-bit="iit">
      </span>
      </td>
      </tr>
      </tbody>
      </table>
`;
}



module.exports = { forgotPasswordHtml, emailVerificationHTML }