

export function ExplorerSmall() {


  return (
    <ul className="explorer-small">
      <li>one</li>
      <li>two
        <ul>
          <li>two.one</li>
          <li>two.two</li>
        </ul>
      </li>
      <li>three</li>
    </ul>
  )
}