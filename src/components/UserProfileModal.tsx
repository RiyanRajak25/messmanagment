import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { useToast } from './Toast';
import { BrandMark } from './brand/BrandMark';
import {
  User,
  Shield,
  ShieldCheck,
  Lock,
  Bell,
  Sliders,
  Key,
  Smartphone,
  Laptop,
  CheckCircle2,
  RefreshCw,
  Building,
  Award,
  Eye,
  EyeOff,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, role } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'session'>('profile');

  // Form states for profile
  const [displayName, setDisplayName] = useState(user?.name || 'Authorized Officer');
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [assignedDepartment, setAssignedDepartment] = useState('Central Logistics Operations Directorate');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Form states for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Notification toggles
  const [notifyLowStock, setNotifyLowStock] = useState(true);
  const [notifyConsignments, setNotifyConsignments] = useState(true);
  const [notifyBudgets, setNotifyBudgets] = useState(false);
  const [notifyDailyMeal, setNotifyDailyMeal] = useState(true);

  // Role metadata details
  const getRoleDetails = () => {
    switch (role) {
      case 'administrator':
        return {
          title: 'Station Administration Director',
          clearance: 'Level 4 • Command Level (Unrestricted)',
          serviceId: 'RMS-ADM-84920',
          badgeColor: 'bg-gold text-night border-gold/60',
          permissions: [
            'All Dining Messes Oversight & Headcount Quotas',
            'Full Purchase Order Indent Authorization',
            'Station Audit Log Inspection & Export',
            'Supplier Tender Management & Vendor Creation',
            'Master Ration Scale Catalog Alteration',
          ],
        };
      case 'store_keeper':
        return {
          title: 'Quartermaster & Depot Superintendent',
          clearance: 'Level 3 • Central Depot Storage',
          serviceId: 'RMS-QM-31048',
          badgeColor: 'bg-olive text-snow border-sand/40',
          permissions: [
            'Physical Consignment Unload & Inward Challans',
            'Multi-Mess Ration Dispatches & Outward Issues',
            'Depot Spoilage & Condemnation Write-offs',
            'Stock Ledger Verification & Safety Threshold Monitoring',
            'Raise Supplier Indents (POs)',
          ],
        };
      case 'mess_manager':
        return {
          title: 'Unit Dining Mess Manager',
          clearance: 'Level 2 • Dining Facility',
          serviceId: 'RMS-MM-59312',
          badgeColor: 'bg-glacier text-snow border-glacier/40',
          permissions: [
            'Daily Meal Attendance & Headcount Certification',
            'Unit Pantry Stock Receiving & Storage Management',
            'Live Ration Meal Log Submissions',
            'Weekly Menu Planning & Calorie Calculations',
            'Diner Taste & Portion Quality Auditing',
          ],
        };
      case 'finance_staff':
        return {
          title: 'Central Accounts & Fiscal Officer',
          clearance: 'Level 3 • Treasury & Audit',
          serviceId: 'RMS-FIN-77215',
          badgeColor: 'bg-night text-sand border-sand/40',
          permissions: [
            'Operational Grant Allocations & Quarterly Ceilings',
            'Purchase Order Commercial Liability Audits',
            'Supplier Payment Disbursements (RTGS/Treasury)',
            'Cryptographic Audit Ledger Verification',
            'Fiscal Variance Inspection & Sanction Reports',
          ],
        };
      case 'vendor':
        return {
          title: 'Certified Provisions Supplier Representative',
          clearance: 'Level 1 • External Logistics Partner',
          serviceId: 'RMS-VND-10492',
          badgeColor: 'bg-sand/30 text-olive-deep border-sand',
          permissions: [
            'View Allocated Station Purchase Orders',
            'Issue Advance Shipping Notices (ASN) & Challans',
            'Vehicle Logistics & Driver Dispatch Reporting',
            'Contract Fulfillment History Tracking',
          ],
        };
      default:
        return {
          title: 'Operational Staff',
          clearance: 'Level 1 • Standard',
          serviceId: 'RMS-GEN-00000',
          badgeColor: 'bg-sand text-olive border-sand',
          permissions: ['View Authorized Views'],
        };
    }
  };

  const details = getRoleDetails();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      toast({
        title: 'Profile Updated',
        message: 'Personal appointment details saved to station personnel records.',
      });
    }, 400);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast({ type: 'warning', title: 'Missing Password', message: 'Please enter your current security passcode.' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ type: 'error', title: 'Weak Password', message: 'New security code must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ type: 'error', title: 'Mismatch', message: 'New password and confirmation do not match.' });
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({
        title: 'Security Code Updated',
        message: 'Station access credentials refreshed. Digital signature token re-keyed.',
      });
    }, 500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Station Personnel Profile & Security Clearance"
      description="Authorized identification, operational appointment privileges, and account security."
      maxWidth="xl"
    >
      <div className="flex flex-col gap-5 font-body text-pine">
        {/* Officer Identity Header Card */}
        <div className="p-4 rounded-card bg-night text-snow border border-sand/40 shadow-subtle flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-card bg-olive border-2 border-gold flex items-center justify-center text-gold shadow-subtle shrink-0">
              <BrandMark variant="shield" size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-base md:text-lg text-snow tracking-wide">
                  {displayName}
                </h3>
                <span className={`px-2 py-0.5 rounded-badge text-[9px] font-heading font-extrabold uppercase border ${details.badgeColor}`}>
                  {details.clearance.split('•')[0]}
                </span>
              </div>
              <p className="text-xs text-sand font-medium mt-0.5">{details.title}</p>
              <div className="flex items-center gap-3 text-[10px] font-mono text-sand/80 mt-1">
                <span>ID: {details.serviceId}</span>
                <span>•</span>
                <span className="text-success font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED ACTIVE
                </span>
              </div>
            </div>
          </div>

          <div className="text-right sm:self-center font-mono text-[10px] text-sand/80 bg-night/70 p-2.5 rounded-control border border-sand/20">
            <div className="text-gold font-bold">DIGITAL SIGNATURE STAMP</div>
            <div className="text-sand font-mono mt-0.5 truncate max-w-[190px]">SHA256: 4e8b...9f21</div>
          </div>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex border-b border-sand/40 gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'profile', label: 'Appointment Details', icon: User },
            { id: 'security', label: 'Clearance & Access', icon: ShieldCheck },
            { id: 'preferences', label: 'Alert Preferences', icon: Bell },
            { id: 'session', label: 'Active Session', icon: Laptop },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-heading font-bold border-b-2 transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'border-olive text-olive-deep bg-snow/80'
                    : 'border-transparent text-pine/60 hover:text-olive-deep hover:bg-snow/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-gold' : 'text-sand'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Profile Details */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                  Full Name &amp; Title
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full px-3 py-2 font-sans font-semibold rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                  Official Station Email
                </label>
                <input
                  type="email"
                  value={user?.email || 'officer@messmunch.edu'}
                  disabled
                  className="w-full px-3 py-2 font-mono rounded-control border border-sand/40 bg-sand/15 text-pine/70 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                  Operational Duty Phone
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 font-mono rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                  Assigned Command Division
                </label>
                <input
                  type="text"
                  value={assignedDepartment}
                  onChange={(e) => setAssignedDepartment(e.target.value)}
                  className="w-full px-3 py-2 font-sans rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
                />
              </div>
            </div>

            <div className="p-3 bg-snow rounded-control border border-sand/40 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-olive-deep">Station Station Location:</span>
                <span className="ml-1.5 text-pine/80 font-medium">Post Alpha Central Logistics Depot (Sector 4)</span>
              </div>
              <span className="text-[10px] font-mono text-sand font-bold bg-olive px-2 py-0.5 rounded text-snow">
                ALT: 4,800m
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-sand/40">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={isSavingProfile}>
                {isSavingProfile ? 'Saving...' : 'Save Appointment Changes'}
              </Button>
            </div>
          </form>
        )}

        {/* TAB 2: Clearance & Access */}
        {activeTab === 'security' && (
          <div className="flex flex-col gap-4 text-xs">
            <div className="p-3.5 rounded-card bg-snow border border-sand/60">
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading font-bold text-olive uppercase tracking-wider text-[11px]">
                  Verified Security Clearance
                </span>
                <span className="font-mono text-xs font-bold text-success">STATUS: CLEARED</span>
              </div>
              <div className="text-sm font-heading font-bold text-olive-deep">{details.clearance}</div>
              <p className="text-pine/70 text-[11px] mt-1">
                Authorized by Central Logistics Command. Grants role-bound write permissions to tamper-evident ledgers.
              </p>
            </div>

            <div>
              <h4 className="font-heading font-bold text-olive uppercase text-[11px] mb-2 tracking-wider">
                Granted Operational Privileges
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {details.permissions.map((perm, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-control bg-white border border-sand/60 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    <span className="text-olive-deep font-medium text-[11px]">{perm}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Change Password / PIN Form */}
            <div className="mt-2 pt-3 border-t border-sand/40">
              <h4 className="font-heading font-bold text-olive uppercase text-[11px] mb-2 tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-gold" />
                <span>Update Access Passcode &amp; PIN</span>
              </h4>
              <form onSubmit={handleUpdatePassword} className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-heading font-bold text-pine/80 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-1.5 text-xs font-mono rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-heading font-bold text-pine/80 mb-1">
                      New Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 chars"
                      className="w-full px-3 py-1.5 text-xs font-mono rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-heading font-bold text-pine/80 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm code"
                      className="w-full px-3 py-1.5 text-xs font-mono rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-olive font-bold hover:underline flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
                  </button>

                  <Button type="submit" variant="secondary" size="sm" disabled={isUpdatingPassword}>
                    {isUpdatingPassword ? 'Updating...' : 'Update Security Passcode'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: Operational Preferences */}
        {activeTab === 'preferences' && (
          <div className="flex flex-col gap-4 text-xs">
            <p className="text-pine/70 text-[11px] leading-relaxed">
              Configure automated operational alerts broadcast to your personal station terminal.
            </p>

            <div className="flex flex-col gap-2.5">
              {[
                {
                  id: 'stock',
                  label: 'Depot Reserve Low-Stock Warning',
                  desc: 'Trigger urgent alert when dry grain or dal reserves fall below 7 days buffer.',
                  checked: notifyLowStock,
                  setter: setNotifyLowStock,
                },
                {
                  id: 'consignments',
                  label: 'Contracted Consignment Gate Arrival',
                  desc: 'Notify when certified supplier truck logs gate entry at depot unloading bay.',
                  checked: notifyConsignments,
                  setter: setNotifyConsignments,
                },
                {
                  id: 'budgets',
                  label: 'Budget Grant Variance & Overdraw Advisory',
                  desc: 'Notify if institutional mess ration requisitions reach 85% of monthly grant.',
                  checked: notifyBudgets,
                  setter: setNotifyBudgets,
                },
                {
                  id: 'daily',
                  label: 'Daily Ration Consumption Sign-Off',
                  desc: 'Daily reminder at 19:00 IST to certify dinner headcount and meal ration deductions.',
                  checked: notifyDailyMeal,
                  setter: setNotifyDailyMeal,
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-control bg-white border border-sand/60 flex items-center justify-between gap-4"
                >
                  <div>
                    <h5 className="font-heading font-bold text-olive-deep text-xs">{item.label}</h5>
                    <p className="text-pine/60 text-[11px] mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.setter(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-sand/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-sand after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-olive" />
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-sand/40">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  toast({
                    title: 'Preferences Saved',
                    message: 'Notification filters and station alert routing updated.',
                  });
                }}
              >
                Save Preferences
              </Button>
            </div>
          </div>
        )}

        {/* TAB 4: Active Session */}
        {activeTab === 'session' && (
          <div className="flex flex-col gap-4 text-xs font-sans">
            <div className="p-3.5 rounded-card bg-snow border border-sand/60 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-sand/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-olive" />
                  <span className="font-heading font-bold text-olive-deep text-xs">
                    Current Active Station Workstation
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-badge bg-success/15 text-success font-mono text-[10px] font-bold border border-success/30">
                  CURRENT SESSION
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-pine/60 block">Internal IP Address:</span>
                  <span className="font-mono font-bold text-olive-deep">10.48.12.19 (Protected Ops Network)</span>
                </div>
                <div>
                  <span className="text-pine/60 block">Authentication Timestamp:</span>
                  <span className="font-mono text-olive-deep">Today, 08:30:15 IST</span>
                </div>
                <div>
                  <span className="text-pine/60 block">Terminal Architecture:</span>
                  <span className="font-mono text-olive-deep">Windows x64 • Chromium Browser</span>
                </div>
                <div>
                  <span className="text-pine/60 block">Station Security Node:</span>
                  <span className="font-mono text-olive-deep">HQ-GATEWAY-ALPHA-01</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-control bg-white border border-sand/60 flex items-center justify-between">
              <div>
                <h5 className="font-heading font-bold text-olive-deep text-xs">Terminal Security Seal</h5>
                <p className="text-pine/60 text-[11px] mt-0.5">
                  Terminates any stale authentication tokens across other post computers.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    title: 'Sessions Terminated',
                    message: 'All other network sessions closed. Current terminal certified.',
                  });
                }}
              >
                Sign Out Other Devices
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UserProfileModal;
