import React from 'react';
import { Button, Card, CardContent } from '@gateflow/ui';
import { Plus, Save, RotateCcw } from 'lucide-react';
import { MenuItem, MenuItemRow } from './menu-item-row';
import { toast } from 'sonner';

interface MenuBuilderProps {
  initialItems: MenuItem[];
  onSave: (items: MenuItem[]) => Promise<void>;
}

export function MenuBuilder({ initialItems, onSave }: MenuBuilderProps) {
  const [items, setItems] = React.useState<MenuItem[]>(initialItems);
  const [isSaving, setIsSaving] = React.useState(false);

  const addItem = () => {
    const newItem: MenuItem = {
      id: `item_${Date.now()}`,
      label: '',
      labelAr: '',
      url: '',
      type: 'page',
      children: [],
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (index: number, updated: MenuItem) => {
    const newItems = [...items];
    newItems[index] = updated;
    setItems(newItems);
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(items);
      toast.success('Menu structure saved successfully!');
    } catch (error) {
      toast.error('Failed to save menu');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-ds-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-ds-text">
                Menu Structure
              </h2>
              <p className="text-sm text-ds-text-subtle">
                Drag and drop items to reorder and nest up to 2 levels.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setItems(initialItems)}
                disabled={isSaving}
              >
                <RotateCcw className="h-4 w-4 mr-2" /> Reset
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-ds-background-brand-bold text-ds-text-inverse hover:bg-ds-background-brand-bold/90"
              >
                <Save className="h-4 w-4 mr-2" />{' '}
                {isSaving ? 'Saving...' : 'Save Menu'}
              </Button>
            </div>
          </div>

          <div className="space-y-3 min-h-[200px] border-2 border-dashed border-ds-border rounded-xl p-4 bg-ds-surface-subtle/30">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-ds-text-subtlest">
                <p className="mb-4">No menu items yet.</p>
                <Button variant="outline" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" /> Add First Item
                </Button>
              </div>
            ) : (
              items.map((item, index) => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  onUpdate={(updated) => handleUpdateItem(index, updated)}
                  onDelete={() => handleDeleteItem(index)}
                />
              ))
            )}

            {items.length > 0 && (
              <Button
                variant="outline"
                className="w-full border-dashed border-ds-border hover:border-ds-border-brand bg-ds-surface hover:bg-ds-background-brand-subtle text-ds-text-subtle hover:text-ds-text-brand mt-4"
                onClick={addItem}
              >
                <Plus className="h-4 w-4 mr-2" /> Add New Root Item
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
