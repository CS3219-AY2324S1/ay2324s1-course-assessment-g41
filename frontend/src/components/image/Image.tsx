import { Box, ChakraComponent } from "@chakra-ui/react";
import * as React from "react";
import NextImage, { StaticImageData } from "next/image";
import { BoxProps } from "@chakra-ui/react";

interface ImageProps extends BoxProps {
  src: StaticImageData | string;
  alt?: string;
}

export const Image = (props: ImageProps) => {
  const { src, alt, ...rest } = props;
  return (
    <Box overflow={"hidden"} position="relative" {...rest}>
      <NextImage objectFit="cover" layout="fill" src={src} alt={alt || ""} />
    </Box>
  );
};
