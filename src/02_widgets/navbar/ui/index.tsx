import { useEffect, useState } from "react";
import {
  Center,
  Tooltip,
  UnstyledButton,
  Stack,
  rem,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconCalendarStats,
  IconUser,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
  IconLanguage,
  IconFileUpload,
  IconFileDownload,
  IconMarkdown,
  IconMoon,
  IconSunHigh,
} from "@tabler/icons-react";
import classes from "./navbar.module.css";
import { useTranslation } from "react-i18next";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
  disabled?: boolean;
}

function NavbarLink({
  icon: Icon,
  label,
  active,
  onClick,
  disabled,
}: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
        disabled={disabled}
      >
        <Icon style={{ width: rem(25), height: rem(25) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  // { icon: IconHome2, label: 'Home' },
  // { icon: IconGauge, label: 'Dashboard' },
  // { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
  // { icon: IconCalendarStats, label: 'Releases' },
  // { icon: IconUser, label: 'Account' },
  // { icon: IconFingerprint, label: 'Security' },
  // { icon: IconSettings, label: 'Settings' },
  { icon: IconLanguage, label: "Language" },
];

const getLanguage = (): "en" | "ru" => {
  if (typeof window !== "undefined") {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      return JSON.parse(storedLanguage);
    }
  }
  return "ru";
};

export function Navbar() {
  const [active, setActive] = useState(2);
  const [language, setLanguage] = useState<"en" | "ru">("ru");
  const { t, i18n } = useTranslation();
  const { colorScheme, setColorScheme } = useMantineColorScheme({
    // keepTransitions: true,
  });
  const computedColorScheme = useComputedColorScheme("light");

  useEffect(() => {
    const initialLanguage = getLanguage();
    setLanguage(initialLanguage);
    i18n.changeLanguage(initialLanguage);
  }, []);

  const handleLanguageChange = () => {
    const newLanguage = language === "en" ? "ru" : "en";
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
    localStorage.setItem("language", JSON.stringify(newLanguage));
  };
  const handleThemeChange = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center>
        {/* <MantineLogo type="mark" size={30} /> */}
        <h2>SG</h2>
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {/* {links} */}
          <NavbarLink
            icon={IconLanguage}
            label={t("navbar.changeLanguage")}
            onClick={handleLanguageChange}
          />
          <NavbarLink
            icon={IconFileDownload}
            label={t("navbar.backup")}
            disabled
          />
          <NavbarLink
            icon={IconFileUpload}
            label={t("navbar.restore")}
            disabled
          />
          <NavbarLink
            icon={IconMarkdown}
            label={t("navbar.exportToMarkdown")}
            disabled
          />
          <NavbarLink
            icon={computedColorScheme === "light" ? IconMoon : IconSunHigh}
            label={
              computedColorScheme === "light"
                ? t("navbar.lightMode")
                : t("navbar.darkMode")
            }
            onClick={handleThemeChange}
          />
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink
          icon={IconSwitchHorizontal}
          label={t("navbar.changeAccount")}
          disabled
        />
        <NavbarLink icon={IconLogout} label={t("navbar.logout")} disabled />
      </Stack>
    </nav>
  );
}
