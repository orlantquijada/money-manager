import { useColorScheme } from "nativewind";
import { createContext, type ReactNode, useContext } from "react";
import { View } from "react-native";
import { type Theme, themes } from "@/utils/color-theme";

type ThemeProviderProps = {
  children: ReactNode;
  initialTheme?: Theme;
};

type ThemeContextType = {
  theme: Theme | undefined;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({
  children,
  initialTheme = "light",
}: ThemeProviderProps) {
  const { setColorScheme, colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <ThemeContext.Provider
      value={{
        theme: colorScheme,
        setTheme: setColorScheme,
        toggleTheme: toggleColorScheme,
        isDark: colorScheme === "dark",
      }}
    >
      <View style={[{ flex: 1 }, themes[colorScheme || initialTheme]]}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
