export default function BumbleFlowPrototype({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
