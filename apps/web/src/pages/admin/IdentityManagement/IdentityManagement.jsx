import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import CreateIdentityModal from '../modals/CreateIdentityModal/CreateIdentityModal';
import '../../../assets/styles/IdentityManagement.css';

const mockData = [
  { 
    id: "9x-7721-a4", 
    displayName: "James Summers", 
    email: "james.summers@nova.tech",
    initials: "JS", 
    color: "#3b82f6",
    status: "Active", 
    regDate: "Oct 24, 2023",
    access: true 
  },
  { 
    id: "2p-9910-c1", 
    displayName: "Mohamed Khalid", 
    email: "m.khalid@global-corp.net",
    initials: "MK", 
    color: "#8b5cf6",
    status: "Active", 
    regDate: "Dec 02, 2023",
    access: true 
  },
  { 
    id: "5j-1284-e9", 
    displayName: "Laura Anderson", 
    email: "l.anderson@external.io",
    initials: "LA", 
    color: "#ec4899",
    status: "Disabled", 
    regDate: "Jan 15, 2024",
    access: false 
  },
];

export default function IdentityManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [identities, setIdentities] = useState(mockData);

  const toggleAccess = (id) => {
    setIdentities(prev => 
      prev.map(item => 
        item.id === id ? { ...item, access: !item.access } : item
      )
    );
  };

  const columns = [
    {
      key: "user",
      header: "USER ENTITY",
      cell: (row) => (
        <div className="user-entity">
          <div className="avatar" style={{ backgroundColor: row.color }}>
            {row.initials}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{row.displayName}</div>
            <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>{row.email}</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>ID: {row.id}</div>
          </div>
        </div>
      )
    },
    {
      key: "status",
      header: "STATUS",
      cell: (row) => (
        <span className={row.status === "Active" ? "status-active" : "status-disabled"}>
          {row.status}
        </span>
      )
    },
    { 
      key: "regDate", 
      header: "REGISTRATION DATE", 
      cell: (row) => row.regDate 
    },
    {
      key: "access",
      header: "ACCESS CONTROL",
      cell: (row) => (
        <input
          type="checkbox"
          checked={row.access || false}
          onChange={() => toggleAccess(row.id)}
          style={{
            width: "20px",
            height: "20px",
            accentColor: "#000000",
            cursor: "pointer"
          }}
        />
      ),
      align: "center"
    },
  ];

  return (
    <div className="identities-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Identities</h1>
          <p className="page-desc">
            Manage and provision digital sovereign identities across your enterprise ecosystem.
          </p>
        </div>
        
      <Button 
          variant="primary"
          onClick={() => setIsModalOpen(true)}
        >
          + Create Identity
      </Button>
      </div>

      {/* Stats */}
      <div className="stats-container">
        <Card>
          <div style={{ padding: "20px" }}>
            <div>TOTAL USERS</div>
            <h2>1,284</h2>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "20px" }}>
            <div>ACTIVE NOW</div>
            <h2>942</h2>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="search-filter-bar">
        <input 
          type="text" 
          placeholder="Filter by email or ID..." 
          className="search-input" 
        />
        <Button variant="secondary">Filters</Button>
        <Button variant="secondary">Export CSV</Button>
      </div>

      {/* Table */}
      <div className="table-container">
        <DataTable
          columns={columns}
          rows={identities}
          rowKey={(row) => row.id}
        />
      </div>

      {/* Modal */}
      <CreateIdentityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}