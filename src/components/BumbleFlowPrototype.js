export default function BumbleFlowPrototype({ html }) {
  return (
    <div className="prototype-stage">
      <div className="phone-scale-host" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
