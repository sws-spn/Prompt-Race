import { useState } from 'react';
import { Button, Card, Modal, Input, TextArea } from '../components/ui';
import { useGame } from '../context/GameContext';
import {
  getCustomScenarios,
  addCustomScenario,
  updateCustomScenario,
  deleteCustomScenario,
} from '../lib/storage';
import type { Scenario, Category, Difficulty } from '../types';

const CATEGORIES: { id: Category; label: string; color: string }[] = [
  { id: 'troubleshooting', label: 'Troubleshooting', color: 'red' },
  { id: 'client-communication', label: 'Client Communication', color: 'blue' },
  { id: 'documentation', label: 'Documentation', color: 'green' },
  { id: 'research', label: 'Research', color: 'purple' },
];

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; color: string }[] = [
  { value: 1, label: 'Easy', color: 'green' },
  { value: 2, label: 'Medium', color: 'yellow' },
  { value: 3, label: 'Hard', color: 'red' },
];

interface ScenarioFormData {
  title: string;
  category: Category;
  situation: string;
  roleHint: string;
  difficulty: Difficulty;
  idealElements: string;
  examplePrompt: string;
  breakdownContext: string;
  breakdownTaskClarity: string;
  breakdownConstraints: string;
  breakdownAup: string;
  breakdownPractical: string;
}

const emptyFormData: ScenarioFormData = {
  title: '',
  category: 'troubleshooting',
  situation: '',
  roleHint: '',
  difficulty: 2,
  idealElements: '',
  examplePrompt: '',
  breakdownContext: '',
  breakdownTaskClarity: '',
  breakdownConstraints: '',
  breakdownAup: '',
  breakdownPractical: '',
};

function formDataToScenario(data: ScenarioFormData): Omit<Scenario, 'id'> {
  return {
    title: data.title,
    category: data.category,
    situation: data.situation,
    roleHint: data.roleHint || undefined,
    difficulty: data.difficulty,
    idealElements: data.idealElements.split('\n').filter((s) => s.trim()),
    examplePrompt: {
      prompt: data.examplePrompt,
      breakdown: {
        context: data.breakdownContext,
        taskClarity: data.breakdownTaskClarity,
        constraintsFormat: data.breakdownConstraints,
        aupAwareness: data.breakdownAup,
        practicalValue: data.breakdownPractical,
      },
    },
  };
}

function scenarioToFormData(scenario: Scenario): ScenarioFormData {
  return {
    title: scenario.title,
    category: scenario.category,
    situation: scenario.situation,
    roleHint: scenario.roleHint || '',
    difficulty: scenario.difficulty,
    idealElements: scenario.idealElements.join('\n'),
    examplePrompt: scenario.examplePrompt.prompt,
    breakdownContext: scenario.examplePrompt.breakdown.context,
    breakdownTaskClarity: scenario.examplePrompt.breakdown.taskClarity,
    breakdownConstraints: scenario.examplePrompt.breakdown.constraintsFormat,
    breakdownAup: scenario.examplePrompt.breakdown.aupAwareness,
    breakdownPractical: scenario.examplePrompt.breakdown.practicalValue,
  };
}

export function CustomScenariosScreen() {
  const { dispatch } = useGame();
  const [customScenarios, setCustomScenarios] = useState<Scenario[]>(getCustomScenarios);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [formData, setFormData] = useState<ScenarioFormData>(emptyFormData);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const refreshScenarios = () => {
    setCustomScenarios(getCustomScenarios());
  };

  const handleOpenAdd = () => {
    setFormData(emptyFormData);
    setEditingScenario(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (scenario: Scenario) => {
    setFormData(scenarioToFormData(scenario));
    setEditingScenario(scenario);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingScenario(null);
    setFormData(emptyFormData);
  };

  const handleSave = () => {
    if (!formData.title || !formData.situation || !formData.examplePrompt) {
      return; // Basic validation
    }

    const scenarioData = formDataToScenario(formData);

    if (editingScenario) {
      updateCustomScenario(editingScenario.id, scenarioData);
    } else {
      addCustomScenario(scenarioData);
    }

    refreshScenarios();
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    deleteCustomScenario(id);
    refreshScenarios();
    setDeleteConfirm(null);
  };

  const isFormValid =
    formData.title.trim() &&
    formData.situation.trim() &&
    formData.examplePrompt.trim() &&
    formData.breakdownContext.trim() &&
    formData.breakdownTaskClarity.trim() &&
    formData.breakdownConstraints.trim() &&
    formData.breakdownAup.trim() &&
    formData.breakdownPractical.trim();

  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Custom Scenarios</h1>
            <p className="text-slate-400">
              Create company-specific scenarios for training
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => dispatch({ type: 'RESET_GAME' })}>
              Back to Menu
            </Button>
            <Button onClick={handleOpenAdd}>+ Add Scenario</Button>
          </div>
        </div>

        {/* Scenario List */}
        {customScenarios.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Custom Scenarios</h3>
            <p className="text-slate-400 mb-6">
              Create scenarios specific to your organization's needs
            </p>
            <Button onClick={handleOpenAdd}>Create Your First Scenario</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {customScenarios.map((scenario) => {
              const catInfo = CATEGORIES.find((c) => c.id === scenario.category);
              const diffInfo = DIFFICULTY_OPTIONS.find((d) => d.value === scenario.difficulty);

              return (
                <Card key={scenario.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs bg-${catInfo?.color}-500/20 text-${catInfo?.color}-400`}
                        >
                          {catInfo?.label}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs bg-${diffInfo?.color}-500/20 text-${diffInfo?.color}-400`}
                        >
                          {diffInfo?.label}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">{scenario.title}</h3>
                      <p className="text-slate-400 text-sm line-clamp-2">{scenario.situation}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(scenario)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => setDeleteConfirm(scenario.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Section */}
        <Card className="mt-8 p-4 border-blue-500/30 bg-blue-500/5">
          <h4 className="font-semibold text-blue-400 mb-2">How Custom Scenarios Work</h4>
          <ul className="text-sm text-slate-300 space-y-1">
            <li>• Custom scenarios appear alongside built-in scenarios during game setup</li>
            <li>• Include a gold standard example prompt to help players learn</li>
            <li>• Scenarios are saved locally in your browser</li>
            <li>• Great for company-specific training situations</li>
          </ul>
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={handleCloseModal}
          title={editingScenario ? 'Edit Scenario' : 'Create Custom Scenario'}
        >
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Basic Info */}
            <div className="space-y-4">
              <Input
                label="Title *"
                placeholder="e.g., Password Reset Request"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as Category })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: Number(e.target.value) as Difficulty })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    {DIFFICULTY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <TextArea
                label="Situation *"
                placeholder="Describe the scenario that players will respond to..."
                rows={4}
                value={formData.situation}
                onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
              />

              <Input
                label="Role Hint (optional)"
                placeholder="e.g., IT support specialist at a healthcare company"
                value={formData.roleHint}
                onChange={(e) => setFormData({ ...formData, roleHint: e.target.value })}
              />

              <TextArea
                label="Ideal Elements (one per line)"
                placeholder="Context about the user&#10;Specific error message&#10;Desired format"
                rows={3}
                value={formData.idealElements}
                onChange={(e) => setFormData({ ...formData, idealElements: e.target.value })}
              />
            </div>

            {/* Gold Standard Example */}
            <div className="border-t border-slate-700 pt-4">
              <h4 className="text-lg font-semibold text-white mb-4">
                Gold Standard Example
              </h4>
              <p className="text-sm text-slate-400 mb-4">
                Provide an excellent example prompt that demonstrates best practices
              </p>

              <TextArea
                label="Example Prompt *"
                placeholder="Write the gold standard prompt for this scenario..."
                rows={5}
                value={formData.examplePrompt}
                onChange={(e) => setFormData({ ...formData, examplePrompt: e.target.value })}
              />

              <div className="mt-4 space-y-3">
                <h5 className="text-sm font-medium text-slate-300">
                  Breakdown (explain why each aspect is good)
                </h5>

                <Input
                  label="Context"
                  placeholder="What makes the context strong?"
                  value={formData.breakdownContext}
                  onChange={(e) => setFormData({ ...formData, breakdownContext: e.target.value })}
                />
                <Input
                  label="Task Clarity"
                  placeholder="What makes the task clear?"
                  value={formData.breakdownTaskClarity}
                  onChange={(e) =>
                    setFormData({ ...formData, breakdownTaskClarity: e.target.value })
                  }
                />
                <Input
                  label="Constraints & Format"
                  placeholder="What constraints are specified?"
                  value={formData.breakdownConstraints}
                  onChange={(e) =>
                    setFormData({ ...formData, breakdownConstraints: e.target.value })
                  }
                />
                <Input
                  label="AUP Awareness"
                  placeholder="How is sensitive data handled?"
                  value={formData.breakdownAup}
                  onChange={(e) => setFormData({ ...formData, breakdownAup: e.target.value })}
                />
                <Input
                  label="Practical Value"
                  placeholder="Why would this prompt produce useful output?"
                  value={formData.breakdownPractical}
                  onChange={(e) => setFormData({ ...formData, breakdownPractical: e.target.value })}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <Button variant="ghost" className="flex-1" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSave} disabled={!isFormValid}>
                {editingScenario ? 'Save Changes' : 'Create Scenario'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation */}
        <Modal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          title="Delete Scenario"
        >
          <p className="text-slate-300 mb-6">
            Are you sure you want to delete this scenario? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
