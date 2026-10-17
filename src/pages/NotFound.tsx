import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Compass, ArrowLeft, Mountain } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 font-body text-pine">
      <Card className="max-w-md w-full text-center flex flex-col items-center p-8 bg-white border border-sand/60 shadow-elevation">
        <div className="w-16 h-16 rounded-card bg-olive/15 border border-olive/30 flex items-center justify-center text-olive mb-4">
          <Compass className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-gold text-[10px] font-heading font-bold uppercase tracking-wider mb-2">
          <Mountain className="w-3 h-3 text-gold" />
          <span>STATION GRID ERROR • 404</span>
        </div>

        <h1 className="font-heading font-extrabold text-2xl text-olive-deep tracking-tight">
          Waypoint Coordinate Not Found
        </h1>

        <p className="text-xs text-pine/70 mt-2 mb-6 max-w-sm leading-relaxed">
          The requested operational URL or inventory module does not exist in the HIMRASAD station chart.
        </p>

        <Button
          variant="primary"
          onClick={() => navigate('/')}
          icon={<ArrowLeft className="w-4 h-4" />}
          className="w-full"
        >
          Return to Station Command
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;
