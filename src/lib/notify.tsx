import toast from 'react-hot-toast';
import ToothModal from '../components/ToothModal';

export const notify = {
  success: (message: string, title: string = "Well Done!") => {
    toast.custom(
      (t) => (
        <div className={`${t.visible ? 'animate-in fade-in zoom-in' : 'animate-out fade-out zoom-out'} duration-300`}>
          <ToothModal type="success" title={title} message={message} />
        </div>
      ),
      { duration: 4000, position: 'top-center' }
    );
  },
  error: (message: string, title: string = "Oh No!") => {
    toast.custom(
      (t) => (
        <div className={`${t.visible ? 'animate-in fade-in zoom-in' : 'animate-out fade-out zoom-out'} duration-300`}>
          <ToothModal type="error" title={title} message={message} />
        </div>
      ),
      { duration: 5000, position: 'top-center' }
    );
  }
};
