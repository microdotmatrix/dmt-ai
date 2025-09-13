import { meta } from "@/lib/config";
import {
  Button,
  Container,
  Heading,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface EmailProps {
  name: string;
  email: string;
  message: string;
}

export const EmailTemplate = ({ name, email, message }: EmailProps) => {
  return (
    <Html>
      <Tailwind>
        <Container className="mx-auto my-[40px] max-w-[640px] border border-border rounded-md p-[20px]">
          <Heading className="text-center mb-[12px] text-[24px] font-semibold text-black">
            {meta.title}
          </Heading>
          <Section className="my-[12px]">
            <Text className="text-[14px] text-gray-500 italic">
              Submitted By:
            </Text>
            <Text className="text-[16px] text-black">
              <strong>Name:</strong> {name}
            </Text>
            <Text className="text-[16px] text-black">
              <strong>Email:</strong> {email}
            </Text>
          </Section>
          <Hr />
          <Section className="my-[12px]">
            <Text className="text-[14px] text-gray-500 italic">Message:</Text>
            <Text className="text-[16px] text-black">{message}</Text>
          </Section>
          <Section className="mt-[24px]">
            <Button
              href={meta.url}
              className="w-full px-[20px] py-[12px] text-[16px] font-semibold text-white bg-black rounded-md text-center"
            >
              Go to {meta.title}
            </Button>
          </Section>
        </Container>
      </Tailwind>
    </Html>
  );
};
