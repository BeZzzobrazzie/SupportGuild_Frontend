import { backup, restore } from "../api";


export function BackupOptions() {
  
  function handleClickBackup() {
    backup();
  }
  function handleClickRestore() {
    restore();
  }
  
  return <div>
    <button onClick={handleClickBackup}>Backup</button>
    <button onClick={handleClickRestore}>Restore</button>
  </div>;
}