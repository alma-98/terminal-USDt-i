import {
  hasPermission
} from "../../auth/permissionMatrix.js";

const MENU = [
  ["Dashboard", null, null],

  ["Coin", "coin", "read"],

  ["Admin Wallet", "admin_wallet", "read"],

  ["Destination Wallet", "destination_wallet", "read"],

  ["Transfer", "transfer", "create"],

  ["Hash × Hash", "hash", "read"],

  ["Swap", "swap", "read"],

  ["Burn Request", "burn", "create"],

  ["Audit Log", "audit", "read"]
];

export default function AdminMenu({ user, active, onSelect }) {
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
