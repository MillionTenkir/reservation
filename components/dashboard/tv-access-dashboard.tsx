import React, { useState } from "react";

interface Customer {
  id: string;
  name: string;
  status: string;
  waitTime?: string;
}

interface Employee {
  id: string;
  name: string;
  color: string;
  customers: Customer[];
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customer: Customer;
  employeeColor: string;
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  customer,
  employeeColor,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const isInProgress = customer.status === "In Progress";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-4">
          {isInProgress ? "Complete Process" : "Call Customer"}
        </h3>
        <p className="text-gray-600 mb-6">
          {isInProgress
            ? `Are you sure you want to mark ${customer.name}'s process as complete?`
            : `Are you sure you want to call ${customer.name} to the desk?`}
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              backgroundColor: employeeColor,
              opacity: 0.9,
              transition: "opacity 0.2s",
            }}
            className="px-4 py-2 text-white rounded hover:opacity-100"
          >
            {isInProgress ? "Complete" : "Call"}
          </button>
        </div>
      </div>
    </div>
  );
}

const mockData: Employee[] = [
  {
    id: "1",
    name: "Hawi",
    color: "#4CAF50",
    customers: [
      { id: "1", name: "Mary", status: "In Progress", waitTime: "10 min" },
      { id: "2", name: "Siham", status: "Waiting", waitTime: "5 min" },
    ],
  },
  {
    id: "2",
    name: "Sarah",
    color: "#2196F3",
    customers: [
      { id: "3", name: "Kibrom", status: "In Progress", waitTime: "15 min" },
    ],
  },
  {
    id: "3",
    name: "Helen",
    color: "#FF9800",
    customers: [
      { id: "5", name: "Lidya", status: "In Progress", waitTime: "15 min" },
      { id: "7", name: "Hana", status: "Waiting", waitTime: "15 min" },
    ],
  },
  {
    id: "4",
    name: "Dina",
    color: "#1cfc03",
    customers: [
      { id: "8", name: "Lidya", status: "In Progress", waitTime: "15 min" },
      { id: "9", name: "Gemechiftu", status: "Waiting", waitTime: "15 min" },
      { id: "10", name: "Hana", status: "Waiting", waitTime: "15 min" },
    ],
  },
  {
    id: "5",
    name: "Rediate",
    color: "#0b03fc",
    customers: [
      { id: "11", name: "Lidya", status: "In Progress", waitTime: "15 min" },
      { id: "12", name: "Gemechiftu", status: "Waiting", waitTime: "15 min" },
      { id: "13", name: "Hana", status: "Waiting", waitTime: "15 min" },
      { id: "14", name: "Helina", status: "Waiting", waitTime: "15 min" },
    ],
  },
  // Add more mock data as needed
];

export function TvAccessDashboard() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployeeColor, setSelectedEmployeeColor] =
    useState<string>("");

  const handleCustomerClick = (customer: Customer, employeeColor: string) => {
    setSelectedCustomer(customer);
    setSelectedEmployeeColor(employeeColor);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (selectedCustomer) {
      // Here you would implement the actual logic for handling the confirmation
      // For example, updating the customer's status in your backend
      console.log(`Confirmed action for ${selectedCustomer.name}`);
      if (selectedCustomer.status === "In Progress") {
        console.log("Marking process as complete");
      } else {
        console.log("Calling customer to desk");
      }
    }
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Customers Queue
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mockData.map((employee) => (
          <div key={employee.id} className="flex flex-col">
            {/* Employee Header */}
            <div
              className="bg-white rounded-lg shadow-lg p-4 mb-4"
              style={{ borderTop: `4px solid ${employee.color}` }}
            >
              <h2
                className="text-xl font-semibold text-center"
                style={{ color: employee.color }}
              >
                {employee.name}
              </h2>
            </div>

            {/* Customer List */}
            <div className="flex flex-col gap-3">
              {employee.customers.map((customer) => (
                <div
                  key={customer.id}
                  className="bg-white rounded-lg shadow p-4 cursor-pointer transform transition-transform hover:scale-105"
                  style={{ borderLeft: `3px solid ${employee.color}` }}
                  onClick={() => handleCustomerClick(customer, employee.color)}
                >
                  <div className="text-center">
                    <p className="font-medium">{customer.name}</p>
                    <p
                      className={`text-sm ${
                        customer.status === "In Progress"
                          ? "text-green-500 p-2 rounded-md bg-green-100"
                          : "text-gray-500"
                      } mt-1`}
                    >
                      {customer.status}
                    </p>
                    {customer.waitTime && (
                      <div className="text-sm text-gray-600 mt-1">
                        App. time: {customer.waitTime}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedCustomer && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCustomer(null);
          }}
          onConfirm={handleConfirm}
          customer={selectedCustomer}
          employeeColor={selectedEmployeeColor}
        />
      )}
    </div>
  );
}
