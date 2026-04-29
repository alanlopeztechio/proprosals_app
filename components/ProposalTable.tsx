'use client';

import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { NameCell } from '@/components/cells/NameCell';
import { EditClientDialog } from '@/components/dialogs/EditClientDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

ModuleRegistry.registerModules([AllCommunityModule]);

const myTheme = themeQuartz.withParams({
  backgroundColor: 'var(--background)',
  foregroundColor: 'var(--foreground)',
  borderColor: 'var(--sidebar-border)',
  accentColor: 'var(--sidebar-accent-foreground)',
  headerTextColor: 'var(--muted-foreground)',
  fontFamily: 'var(--font-sans)',
  rowVerticalPaddingScale: 1.5,
});

const ActionCell = (props: any) => {
  const [open, setOpenOnchange] = useState(false);

  const { data, context } = props;
  const { deleteClient } = context;

  const handleDelete = async () => {
    await deleteClient({ id: data._id as Id<'clients'> });
  };

  return (
    <div className="flex justify-center gap-2">
      <EditClientDialog
        client={data}
        open={open}
        onOpenChange={setOpenOnchange}
      />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            title="Eliminar cliente"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              cliente <strong>{data.name}</strong> y todos sus datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface ProposalTableProps {
  clients: Doc<'clients'>[];
}

export function ProposalTable({ clients }: ProposalTableProps) {
  const [gridApi, setGridApi] = React.useState<GridApi | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const deleteClient = useMutation(api.mutations.deleteClient);

  const contextObject = {
    editingClientId,
    setEditingClientId,
    deleteClient,
  };

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: 'title',
        headerName: 'Title',
        width: 140,
        sortable: true,
        cellClass: 'text-sm',
        // cellRenderer: (props: any) => <NameCell data={props.data} />,
      },
      {
        field: 'description',
        headerName: 'Description',
        width: 280,
        sortable: true,
        cellClass: 'text-sm',
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 180,
        sortable: true,
      },
      {
        field: 'totalAmount',
        headerName: 'Total Amount',
        width: 150,
        sortable: true,
      },
      {
        field: 'currency',
        headerName: 'Currency',
        width: 150,
        sortable: true,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        cellRenderer: ActionCell,
      },
    ],
    [],
  );

  const defaultColDef: ColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
    }),
    [],
  );

  return (
    <div className="w-full h-full pb-6">
      <div className="h-full w-full">
        <AgGridReact
          rowData={clients}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={8}
          context={contextObject}
          onGridReady={(params) => setGridApi(params.api)}
          suppressHorizontalScroll={false}
          domLayout="normal"
          rowHeight={60}
          headerHeight={50}
          theme={myTheme}
          rowSelection="single"
        />
      </div>
    </div>
  );
}
