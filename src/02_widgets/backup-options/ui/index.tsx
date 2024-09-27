import { backup } from "../api";


export function BackupOptions() {
  
  function handleClick() {
    backup();
  }
  
  return <div>
    <button onClick={handleClick}>Backup</button>
    <button>Restore</button>
  </div>;
}