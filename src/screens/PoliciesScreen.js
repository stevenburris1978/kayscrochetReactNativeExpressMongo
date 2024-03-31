import React from 'react';
import { ScrollView, StatusBar, Text, StyleSheet, View, SafeAreaView } from 'react-native';

const PoliciesScreen = () => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={[styles.policyContainer, styles.screenBackground]} contentContainerStyle={{ paddingBottom: 30 }}>
            <StatusBar backgroundColor="#F7E7F8" barStyle="dark-content" />
            <Text style={styles.screenTitle}>POLICY:</Text>
            <Text style={styles.header}>Effective Date: 2023</Text>
        <Text style={styles.text}>
          Welcome to Kay's Crochet. This section outlines all Kay's Crochet policies, including the Privacy Policy and additional terms related to sales, shipping, returns, and data deletion. By using Kay's Crochet app, you agree to these terms.
        </Text>
        <Text style={styles.text}>
        See beautiful crocheted items for sale at www.kayscrochet.us  Handmade by Kay with love and care.
        </Text>
        <Text style={styles.subHeader}>Privacy Policy:</Text>

              {/* Information Collection and Use */}
        <Text style={styles.subHeader}>1. Information Collection and Use</Text>
        <Text style={styles.text}>
          <Text style={styles.strong}>Personal Information Collected:</Text> Email address, mailing address, and full name for transactions and delivery of products.
        </Text>
        <Text style={styles.text}>
          <Text style={styles.strong}>Purpose:</Text> To process transactions and deliver products purchased through Kay's Crochet.
        </Text>
              {/* Data Sharing */}
        <Text style={styles.subHeader}>2. Data Security</Text>
        <Text style={styles.text}>
          <Text style={styles.strong}>Measures:</Text> Kay's Crochet secures payments with Stripe (www.stripe.com) and secures user credentials with Django authentication.
          <Text style={styles.strong}>Registration:</Text> Users must sign up with username and email address to interact with the site to like or buy items.
        </Text>

              {/* Changes to Privacy Policy */}
        <Text style={styles.subHeader}>3. Changes to Privacy Policy</Text>
        <Text style={styles.text}>
          <Text style={styles.strong}>Notifications:</Text> Policy updates will be communicated via email. Continued use of Kay's Crochet after changes constitutes acceptance of the new terms.
        </Text>

              {/* Data Sharing */}
        <Text style={styles.subHeader}>4. Data Sharing</Text>
        <Text style={styles.text}>
          <Text style={styles.strong}>Policy:</Text> Kay's Crochet does not share, sell, rent, or trade user's personal information with third parties for commercial purposes.
        </Text>

              {/* User Data Rights */}
        <Text style={styles.subHeader}>5. User Data Rights</Text>
        <Text style={styles.text}>
          <Text style={styles.strong}>Access and Control:</Text> Users can request to access their data, request corrections or updates, and ask for data deletion by emailing kayscrochetus@gmail.com. Please allow up to 30 days for data and account deletion requestions.
        </Text>

              {/* Compliance with Laws */}
        <Text style={styles.subHeader}>6. Compliance with Laws</Text>
        <Text style={styles.text}>
          <Text style={styles.strong}>Adherence:</Text> Following all applicable privacy laws and regulations, including GDPR and CCPA.
        </Text>

              {/* Under 13 Privacy */}
        <Text style={styles.subHeader}>7. Under 13 Privacy</Text>
        <Text style={styles.text}>
        <Text style={styles.strong}>Under 13 Policy: </Text>
          Kay's Crochet is not directed at or meant for the use of children under the age of 13. We do not knowingly collect or keep personal information of children under the age of 13.        
        </Text>

              {/* Permissions */}
        <Text style={styles.subHeader}>8. Permissions</Text>
        <Text style={styles.text}>
        <Text style={styles.strong}>Permissions Policy: </Text>
          Camera permission is used by Kay's Crochet to add pictures of crocheted items for sale. User's only need permissions to receive push notifications to their device when an item is added and for app updates.       
        </Text>

        <Text style={styles.subHeader}>Additional Policies:</Text>

              {/* Sales Tax */}
        <Text style={styles.subHeader}>9. Sales Tax</Text>
        <Text style={styles.text}>
          <Text style={styles.strong}>Tax Policy:</Text>  Sales tax is not included in the listed prices.
        </Text>

              {/* Shipping Policy */}
        <Text style={styles.subHeader}>10. Shipping Policy</Text>
        <Text style={styles.text}>
          <Text style={styles.strong}>Domestic Shipping:</Text> Shipping is included for the US only.
        </Text>
        <Text style={styles.text}>
          <Text style={styles.strong}>International Shipping:</Text>  Items are not shipped outside the US.
        </Text>

              {/*  Returns and Refunds */}
        <Text style={styles.subHeader}>11. Returns and Refunds</Text>
        <Text style={styles.text}>
          <Text style={styles.strong}>Policy:</Text> There are no refunds and no returns. An invoice will be emailed upon payment.
        </Text>

              {/* Personal Information Usage */}
        <Text style={styles.subHeader}>12. Personal Information Usage</Text>
        <Text style={styles.text}>
          <Text style={styles.strong}>Purpose:</Text> Kay's Crochet does not ever share any personal information.
        </Text>

        <Text style={styles.text}>
          For questions about these policies, please contact Kay's Crochet at:
        </Text>
        <Text style={styles.strong}>
          kayscrochetus@gmail.com
        </Text>

        </ScrollView>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    policyContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: 'transparent',
        paddingBottom: 30,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'hsl(270, 50%, 60%)'
    },
    subHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
        color: 'hsl(270, 50%, 60%)'
    },
    text: {
        fontSize: 14,
        marginBottom: 5,
        color: 'hsl(270, 50%, 60%)'
    },
    strong: {
        fontWeight: 'bold',
        color: 'hsl(270, 50%, 60%)'
    },
    screenBackground: {
        backgroundColor: '#F7E7F8',
    },
    screenTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'hsl(270, 50%, 60%)',
      marginBottom: 10,
      marginTop: -7,
    },
});

export default PoliciesScreen;
