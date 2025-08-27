"use client";

import { Icon as IconifyIcon, IconProps } from "@iconify/react";

export const Icon = ({ icon, ...props }: IconProps) => {
  return <IconifyIcon icon={icon} {...props} />;
};
