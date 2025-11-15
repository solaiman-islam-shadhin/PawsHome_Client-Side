import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel, 
  getPaginationRowModel,
  createColumnHelper 
} from '@tanstack/react-table';
import toast from 'react-hot-toast';
import { Edit, Trash2, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { petAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { TableSkeleton } from '../../components/ui/LoadingSkeleton';

const MyPets = () => {
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, pet: null });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-pets', pagination.pageIndex + 1],
    queryFn: () => petAPI.getMyPets({ 
      page: pagination.pageIndex + 1, 
      limit: pagination.pageSize 
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: petAPI.deletePet,
    onSuccess: () => {
      toast.success('Pet deleted successfully');
      queryClient.invalidateQueries(['my-pets']);
      setDeleteModal({ isOpen: false, pet: null });
    },
    onError: () => {
      toast.error('Failed to delete pet');
    },
  });

  const adoptMutation = useMutation({
    mutationFn: petAPI.markAsAdopted,
    onSuccess: () => {
      toast.success('Pet adoption status updated');
      queryClient.invalidateQueries(['my-pets']);
    },
    onError: () => {
      toast.error('Failed to update adoption status');
    },
  });

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Pet Name',
      cell: info => (
        <div className="flex items-center space-x-3">
          <img
            src={info.row.original.image}
            alt={info.getValue()}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <span className="font-medium">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('category', {
      header: 'Category',
    }),
    columnHelper.accessor('age', {
      header: 'Age',
      cell: info => `${info.getValue()} years`,
    }),
    columnHelper.accessor('adopted', {
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          info.getValue() 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        }`}>
          {info.getValue() ? 'Adopted' : 'Available'}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <div className="flex space-x-2">
          <Link to={`/dashboard/update-pet/${info.row.original._id}`}>
            <Button size="sm" variant="outline">
              <Edit size={16} />
            </Button>
          </Link>
          <Button
            size="sm"
            variant="danger"
            onClick={() => setDeleteModal({ isOpen: true, pet: info.row.original })}
          >
            <Trash2 size={16} />
          </Button>
          <Button
            size="sm"
            variant={info.row.original.adopted ? 'secondary' : 'success'}
            onClick={() => adoptMutation.mutate(info.row.original._id)}
            disabled={adoptMutation.isPending}
          >
            <Check size={16} />
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: data?.totalPages || 0,
    manualPagination: true,
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Added Pets</h1>
        </div>
        <TableSkeleton rows={5} cols={5} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Added Pets</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage all the pets you've added to the platform
          </p>
        </div>
        <Link to="/dashboard/add-pet">
          <Button>Add New Pet</Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center space-x-1">
                        <span>
                          {header.isPlaceholder ? null : header.column.columnDef.header}
                        </span>
                        {header.column.getIsSorted() && (
                          <span>
                            {header.column.getIsSorted() === 'desc' ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronUp size={16} />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {cell.column.columnDef.cell(cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.totalPages > 1 && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
                {Math.min((pagination.pageIndex + 1) * pagination.pageSize, data?.total || 0)} of{' '}
                {data?.total || 0} results
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, pet: null })}
        title="Delete Pet"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete <strong>{deleteModal.pet?.name}</strong>? 
            This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, pet: null })}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteMutation.mutate(deleteModal.pet._id)}
              disabled={deleteMutation.isPending}
              className="flex-1"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyPets;
