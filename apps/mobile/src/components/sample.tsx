import * as DropdownMenu from "zeego/dropdown-menu";
import { StyledLeanText } from "@/config/interop";
import GlassButton from "./glass-button";
import { useThemeColor } from "./theme-provider";

export default function Sample() {
  const muted = useThemeColor("muted");

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <GlassButton size="xl" tintColor={muted}>
          <StyledLeanText className="text-foreground">Hello</StyledLeanText>
        </GlassButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label />
        <DropdownMenu.Item key="1">
          <DropdownMenu.ItemTitle>title</DropdownMenu.ItemTitle>
        </DropdownMenu.Item>
        <DropdownMenu.Group>
          <DropdownMenu.Item key="2">
            <DropdownMenu.ItemTitle>two</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.CheckboxItem key="3" value="mixed">
          <DropdownMenu.ItemTitle>three</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIndicator />
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger key="4">
            <DropdownMenu.ItemTitle>four</DropdownMenu.ItemTitle>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item key="5">
              <DropdownMenu.ItemTitle>five</DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Separator />
        <DropdownMenu.Arrow />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
