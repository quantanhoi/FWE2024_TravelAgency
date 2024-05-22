import { ReactNode } from "react";
import { VStack } from "@chakra-ui/react";
import { Header } from "./Header";
import { Page } from "./Page";

export const BaseLayout = ({
    children,
    rightMenu,
}: {
    children: ReactNode;
    rightMenu?: ReactNode;
}) => {
    return (
        <VStack bg={"green.500"} h={"100vh"} w={"100%"}>
            <Header rightMenu={rightMenu} />

            <Page>{children}</Page>
        </VStack>
    );
};
