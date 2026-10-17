import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ShieldAlert, ArrowLeft, Mountain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CheckpointGraphic } from '../components/brand/CheckpointGraphic';

export const Forbidden: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 font-body text-pine">
      <Card className="max-w-lg w-full text-center flex flex-col items-center p-8 bg-white border border-sand/60 shadow-elevation">
        {/* Authoritative Vector Checkpoint Barrier Graphic */}
        <div className="w-full mb-6">
          <CheckpointGraphic altitude="4,800m" statusText="SECURITY PERIMETER LOCKED" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-danger/10 border border-danger/30 text-danger text-[10px] font-heading font-bold uppercase tracking-wider mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>SECURITY CLASSIFICATION • ACCESS DENIED (403)</span>
        </div>

        <h1 className="font-heading font-extrabold text-2xl text-olive-deep tracking-tight">
          Restricted Operational Sector
        </h1>

        <p className="text-xs text-pine/70 mt-2 mb-6 max-w-sm leading-relaxed">
          Your active appointment (<span className="font-bold font-mono text-olive-deep uppercase">{role?.replace('_', ' ')}</span>) does not possess verified clearance to access this operational console or fiscal ledger.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            icon={<ArrowLeft className="w-4 h-4" />}
            className="flex-1"
          >
            Return to Previous Gate
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            className="flex-1"
          >
            Enter Assigned Station
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Forbidden;
