import { Link } from 'react-router-dom';

interface PermissionCardProps {
  title: string;
  iconUrl?: string;
}

const Alert = ({ title, iconUrl }: PermissionCardProps) => {
  return (
    <section className="flex-center h-screen w-full">
      <div className="w-full max-w-[520px] border-none p-6 py-9 text-white">
        <div>
          <div className="flex flex-col gap-9">
            <div className="flex flex-col gap-3.5">
              {iconUrl && (
                <div className="flex-center">
                  <img src={iconUrl} width={72} height={72} alt="icon" />
                </div>
              )}
              <p className="text-center text-xl font-semibold">{title}</p>
            </div>

            <button className="bg-blue-1">
              <Link to="/meeting">Back to Home</Link>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Alert;