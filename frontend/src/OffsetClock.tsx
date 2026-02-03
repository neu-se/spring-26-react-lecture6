import { useContext } from "react";
import { TimeContext } from "./TimeContext";

interface OffsetClockProps {
  city: string;
  offset: number;
}

export default function OffsetClock(
  props: OffsetClockProps,
) {
  const now = useContext(TimeContext);
  if (now === null) return null;
  const t = new Date(now); // Make a copy before modifying!
  t.setHours(t.getHours() + props.offset);

  return (
    <div
      style={{ border: "1px solid black", padding: "1em" }}
    >
      <div>{props.city}</div>
      <div>
        {`${t.getUTCHours()}`.padStart(2, "0")}:
        {`${t.getUTCMinutes()}`.padStart(2, "0")}:
        {`${t.getUTCSeconds()}`.padStart(2, "0")}
      </div>
    </div>
  );
}
