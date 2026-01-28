interface OffsetClockProps {
  city: string;
  datetime: Date;
  offset: number;
}

export default function OffsetClock(props: OffsetClockProps) {
  const t = new Date(props.datetime); // Make a copy before modifying!
  t.setHours(t.getHours() + props.offset);
  return (
    <div style={{ border: "1px solid black", padding: "1em" }}>
      <div>{props.city}</div>
      <div>
        {`${t.getUTCHours()}`.padStart(2, "0")}:{`${t.getUTCMinutes()}`.padStart(2, "0")}:
        {`${t.getUTCSeconds()}`.padStart(2, "0")}
      </div>
    </div>
  );
}
