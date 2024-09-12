import React from 'react';

import {Body, Head, Heading, Html, Preview, Row, Section, Text} from "@react-email/components";
interface VerificationEmailProps {
    username : string;
    otp : string;
}

export default function VerificationEmail({username,otp} : VerificationEmailProps) {
  return (
   <Html>
    <Head>
        <title>verification code</title>
    </Head>
    <Body>
        <Preview>Here is your verification code {otp}</Preview>
        <Section>
            <Row>
                <Heading>hey {username} hers is your verification code {otp}</Heading>
            </Row>
            <Row>
                <Text>
                    Thanks for registring with us please use the verification code to complete sign up
                </Text>
            </Row>
        </Section>
    </Body>
   </Html>
  )
}
