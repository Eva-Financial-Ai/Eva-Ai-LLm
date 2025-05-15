import FileLockRequest from './FileLockRequest';
import FileLockRequestAdvanced from './FileLockRequestAdvanced';

// Re-export both components with their original names
export { FileLockRequest, FileLockRequestAdvanced };

// Also export a default component that chooses between the simple and advanced versions
interface FileLockProps {
  variant?: 'simple' | 'advanced';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onRequestComplete?: (selectedDocs: any[]) => void;
}

const FileLock: React.FC<FileLockProps> = ({ 
  variant = 'simple', 
  position = 'bottom-right',
  onRequestComplete
}) => {
  return variant === 'advanced' ? (
    <FileLockRequestAdvanced 
      position={position} 
      onRequestComplete={onRequestComplete}
    />
  ) : (
    <FileLockRequest 
      position={position} 
      onRequestComplete={onRequestComplete}
    />
  );
};

export default FileLock; 