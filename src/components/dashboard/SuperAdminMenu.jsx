import { hasPermission } from "../../auth/permissionMatrix.js";

const MENU = [
  ["Dashboard", null, null],
  ["Coin", "coin", "read"],
  ["Tenor", "tenor", "read"],
  ["Deployer Wallet", "deployer_wallet", "read"],
  ["Admin Wallet", "admin_wallet", "read"],
  ["Destination Wallet", "destination_wallet", "read"],
  ["Refill", "refill", "read"],
  ["Transfer", "transfer", "read"],
  ["Hash × Hash", "hash", "read"],
  ["Swap", "swap", "read"],
  ["Burn", "burn", "read"],
  ["Pause", "pause", "read"],
  ["Revoke Mint", "revoke_mint", "read"],
  ["Provider", "provider", "read"],
  ["Admin Management", "admin_management", "read"],
  ["Audit Log", "audit", "read"],
  ["System Settings", "system_settings", "read"]
];

export default function SuperAdminMenu({ user, active, onSelect }) {
  return (
    <nav className="role-menu">
      {MENU.map(([label, module, action]) => {
        const visible =
          module === null ||
          hasPermission(user.role, module, action);

        if (!visible) {
          return null;
        }

        return (
          <button
            key={label}
            className={active === label ? "active" : ""}
            onClick={() => onSelect(label)}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
