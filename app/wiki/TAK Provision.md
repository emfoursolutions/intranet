## Connecting an ATAK Client to the TAK Server

This guide provides step-by-step instructions on how to install the ATAK client and configure it to connect to the TAK Server using a Provision Mission Package.

---
### Prerequisites & Downloads

Before proceeding, ensure you have completed the following steps:
1. **Download the ATAK Client:**
    - Download and install the **ATAK Client** (Civ version) from the Google Play Store: [https://play.google.com/store/apps/details?id=com.atakmap.app.civ&hl=en_AU](https://play.google.com/store/apps/details?id=com.atakmap.app.civ&hl=en_AU)
2. **Download the Provision Mission Package:**
    - Download the **Provision Mission Package** (a `.zip` file) to your device: [http://web-xn-prod-02.chaos1.au:3000/uploads/1761709183737-XNET-ATAK-Industry-Deployment-Package.zip](http://web-xn-prod-02.chaos1.au:3000/uploads/1761709183737-XNET-ATAK-Industry-Deployment-Package.zip)

---
### Client Installation and Deployment Package Import

After installing the ATAK client, you need to import the deployment package to configure the server connection.
1. **Start ATAK and Import Files:**
    - After the installation, you will be presented with the **TAK Device Setup Screen**.
    - Tap the **Import Files** button to begin importing the Deployment Package.
2. **Locate the Deployment Package:**
    - In the next screen, tap **Local SD** and navigate to the folder where you downloaded the `.zip` package in the first step.
    - The file you are looking for will resemble **ATAK_Deployment_Package.zip**. Simply tap on that to select it and then tap **OK**.
3. **Select Import Strategy:**
    - You will be asked how you want the import to be handled. Tap **Copy**.
    - This will commence the import of the Deployment Package.
---
###  TAK Server Authentication and Registration

The Deployment Package import is complete. Now, you must authenticate your device to register it with the TAK Server.
1. **Enter Credentials:**
    - You will be prompted to **Enter Credentials**.
    - **Ensure that you are still connected to the Plexus ISR VPN.**
    - These are the **same credentials** that you used to log in to the VPN and are used to authenticate against the TAK Server and to generate your identification certificate.
    - Enter your credentials and then tap **OK**.
2. **Device Registration:**
    - This will commence the process of **registering your device** onto the Plexus Tier 2 TAK Server.
    - This could take a few minutes. Once complete, you will be notified with a **Registration Succeeded** message.
        
> **Note:** If the registration fails, **check that the VPN Connection to the Plexus Network is still active**. If it has dropped off, reconnect, restart ATAK, and the registration process will recommence.

---
### Callsign and Team Settings

Before closing out of the initial setup screen, adjust your personal identity settings.
1. **Access Identity Settings:**
    - On the TAK Device Setup screen, tap on the **Callsign Identity Button**.
2. **Adjust Callsign, Team, and Role:**
    - You will be presented with the **Callsign Identity screen**.
    - Adjust your **Callsign**, **Team**, and your **Role** according to the details provided by the Plexus Support Team.
    - The colour you select in **My Team** dictates your icon's colour to other users. **Ensure you use the colour assigned to you by the Plexus Team.**        
3. **Complete Setup:**
    - Once you are happy with your configuration, tap **Done** and then **Done** again on the **TAK Device Setup screen**.
---
###  Disable Battery Optimisation

You will be dropped to the main screen and immediately prompted about Disabling Battery Optimisations
1. **Disable Optimisation:**
    - For ATAK to operate even when your screen is off or the app is minimised (to ensure your location is always streamed to the TAK Server), you **must disable Battery Optimisation**.
    - Simply tap **OK** on the warning and then tap **Allow** to stop optimising battery usage.
    
> **Warning:** Disabling optimisation will lead to **increased battery usage** during ATAK usage. Ensure you properly **exit ATAK** when you are not actively using it.

---
###  Verify Connection

- You will now be on the main screen of the ATAK application.
- Look for a **Green icon** in the bottom right of the screen. This indicates that you are successfully **connected to the Plexus TAK Server**.
- If this icon is **red**, it indicates an issue with your connection. Double-check the **VPN** as well as your general **internet connectivity**.