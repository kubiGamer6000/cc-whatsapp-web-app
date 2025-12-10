import React, { useState, useEffect, forwardRef } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CheckSquare, Calendar, User, X, Edit, Trash2, AlertOctagon, ChevronDown, ChevronUp } from 'lucide-react';
import { Task } from '../types';
import TaskEditModal from '../components/TaskEditModal';
import { ConfirmModal } from '../components/ui/modal';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTaskDate, getUrgencyLabel, getUrgencyColor } from '../utils';
import SwipeableTaskCard from '../components/SwipeableTaskCard';
import Loading from '../components/ui/loading';
import PageHeader from '../components/ui/page-header';

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirmTask, setDeleteConfirmTask] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showCancelled, setShowCancelled] = useState(false);

  useEffect(() => {
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const fetchedTasks: Task[] = [];
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" || change.type === "modified") {
            fetchedTasks.push({ id: change.doc.id, ...change.doc.data() } as Task);
          }
        });
        
        setTasks(prevTasks => {
          const updatedTasks = [...prevTasks];
          fetchedTasks.forEach(newTask => {
            const index = updatedTasks.findIndex(t => t.id === newTask.id);
            if (index >= 0) {
              updatedTasks[index] = newTask;
            } else {
              updatedTasks.push(newTask);
            }
          });
          
          snapshot.docChanges().forEach((change) => {
            if (change.type === "removed") {
              const index = updatedTasks.findIndex(t => t.id === change.doc.id);
              if (index >= 0) {
                updatedTasks.splice(index, 1);
              }
            }
          });
          
          return updatedTasks;
        });
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching tasks:', err);
        setError('Failed to fetch tasks. Please try again.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleUpdateTask = async (updatedTask: Partial<Task>) => {
    if (!editingTask) return;
    
    try {
      const taskRef = doc(db, 'tasks', editingTask.id);
      await updateDoc(taskRef, {
        ...updatedTask,
        updatedAt: new Date()
      });
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  const handleQuickStatusUpdate = async (task: Task, newStatus: Task['status']) => {
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, {
        status: newStatus,
        updatedAt: new Date()
      });
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status. Please try again.');
    }
  };

  const handleDeleteTask = async (task: Task) => {
    try {
      await deleteDoc(doc(db, 'tasks', task.id));
      setDeleteConfirmTask(null);
      setExpandedTaskId(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  const getStatusStyles = (status: Task['status'], urgency: number) => {
    if (status === 'completed') {
      return 'bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30 text-green-200 shadow-[inset_0_1px_0_0_rgba(74,222,128,0.1)]';
    }
    if (status === 'cancelled') {
      return 'bg-gradient-to-br from-gray-500/20 to-gray-500/5 border-gray-500/30 text-gray-300 shadow-[inset_0_1px_0_0_rgba(156,163,175,0.1)]';
    }
    return urgency >= 4 
      ? 'bg-gradient-to-br from-red-500/20 to-red-500/5 border-red-500/30 text-red-200 shadow-[inset_0_1px_0_0_rgba(239,68,68,0.1)]'
      : 'bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 text-yellow-200 shadow-[inset_0_1px_0_0_rgba(234,179,8,0.1)]';
  };

  const TaskCard = forwardRef<HTMLDivElement, { task: Task }>(({ task }, ref) => {
    const isExpanded = expandedTaskId === task.id;
    const statusStyles = getStatusStyles(task.status, task.urgency);
    const urgencyColor = getUrgencyColor(task.urgency);
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    
    useEffect(() => {
      if (!showStatusMenu) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.status-menu-container')) {
          setShowStatusMenu(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showStatusMenu]);
    
    return (
      <motion.div 
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className={`
          task-card ${isExpanded ? 'task-card--expanded' : 'task-card--collapsed'}
          ${statusStyles} backdrop-blur-lg
        `}
        onClick={() => !isExpanded && setExpandedTaskId(task.id)}
        style={{ 
          zIndex: isExpanded ? 'var(--z-expanded-card)' : 'auto'
        }}
      >
        <motion.div layout className="p-4">
          {/* Priority Badge */}
          <motion.div 
            layout 
            className="flex items-center justify-between mb-3"
          >
            <div className="relative status-menu-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStatusMenu(!showStatusMenu);
                }}
                className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded-full ${urgencyColor} hover:opacity-90 transition-opacity`}
              >
                <AlertOctagon className="h-3.5 w-3.5" />
                <span>{getUrgencyLabel(task.urgency)} ({task.urgency}/5)</span>
              </button>

              {/* Status Menu */}
              <AnimatePresence>
                {showStatusMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 bg-black/80 backdrop-blur-xl rounded-lg shadow-xl border border-white/10 overflow-hidden z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {task.status !== 'pending' && (
                      <button
                        className="w-full px-4 py-2 text-left text-xs text-yellow-300 hover:bg-yellow-500/10 transition-colors flex items-center gap-2 bg-yellow-500/5"
                        onClick={() => {
                          handleQuickStatusUpdate(task, 'pending');
                          setShowStatusMenu(false);
                        }}
                      >
                        <AlertOctagon className="h-3.5 w-3.5" />
                        Pending
                      </button>
                    )}
                    {task.status !== 'completed' && (
                      <button
                        className="w-full px-4 py-2 text-left text-xs text-green-300 hover:bg-green-500/10 transition-colors flex items-center gap-2 bg-green-500/5"
                        onClick={() => {
                          handleQuickStatusUpdate(task, 'completed');
                          setShowStatusMenu(false);
                        }}
                      >
                        <CheckSquare className="h-3.5 w-3.5" />
                        Completed
                      </button>
                    )}
                    {task.status !== 'cancelled' && (
                      <button
                        className="w-full px-4 py-2 text-left text-xs text-gray-300 hover:bg-gray-500/10 transition-colors flex items-center gap-2 bg-gray-500/5"
                        onClick={() => {
                          handleQuickStatusUpdate(task, 'cancelled');
                          setShowStatusMenu(false);
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                        Cancelled
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isExpanded && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedTaskId(null);
                }}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </motion.button>
            )}
          </motion.div>

          {/* Title */}
          <motion.h3 layout className="text-base font-medium text-white mb-3">
            {task.title}
          </motion.h3>

          {/* Metadata */}
          <motion.div layout className="flex flex-wrap items-center gap-2 text-xs">
            {task.dueDate && (
              <div className="flex items-center gap-1 text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatTaskDate(task.dueDate)}</span>
              </div>
            )}

            <div className="flex items-center gap-1 text-gray-400">
              <User className="h-3.5 w-3.5" />
              <span>{task.contactName}</span>
            </div>
          </motion.div>

          <AnimatePresence mode="popLayout">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-300 text-sm"
                >
                  {task.description}
                </motion.p>

                {task.actions && task.actions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <h4 className="text-sm font-medium text-gray-400">Actions</h4>
                    <div className="space-y-2">
                      {task.actions.map((action, index) => (
                        <motion.div 
                          key={action.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * (index + 1) }}
                          className="flex items-center justify-between p-2 rounded bg-black/20"
                        >
                          <span className="text-sm text-gray-300">{action.description}</span>
                          <div className="flex gap-2">
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className={`p-1.5 rounded ${
                                action.status === 'approved'
                                  ? 'bg-green-900 text-green-200'
                                  : 'bg-green-900/50 text-green-300 hover:bg-green-900'
                              }`}
                            >
                              <CheckSquare className="h-4 w-4" />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className={`p-1.5 rounded ${
                                action.status === 'denied'
                                  ? 'bg-red-900 text-red-200'
                                  : 'bg-red-900/50 text-red-300 hover:bg-red-900'
                              }`}
                            >
                              <X className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-end gap-2 mt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditingTask(task)}
                    className="p-2 rounded bg-blue-900/50 text-blue-300 hover:bg-blue-900"
                  >
                    <Edit className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDeleteConfirmTask(task)}
                    className="p-2 rounded bg-red-900/50 text-red-300 hover:bg-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    );
  });

  TaskCard.displayName = 'TaskCard';

  const sortTasks = (tasksToSort: Task[]) => {
    return [...tasksToSort].sort((a, b) => {
      if (a.urgency !== b.urgency) {
        return b.urgency - a.urgency;
      }
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    });
  };

  const pendingTasks = sortTasks(tasks.filter(task => task.status === 'pending'));
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const cancelledTasks = tasks.filter(task => task.status === 'cancelled');

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
        <Loading message="Loading tasks" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-10rem)]">
      <PageHeader icon={CheckSquare} title="Tasks" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/50 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6"
          >
            <p>{error}</p>
          </motion.div>
        )}

        {tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-md rounded-lg border border-white/10 p-12 text-center mt-6"
          >
            <p className="text-gray-400 text-lg">No tasks found</p>
          </motion.div>
        ) : (
          <motion.div layout className="space-y-8 mt-6">
            <AnimatePresence mode="popLayout">
              {/* Pending Tasks */}
              {pendingTasks.length > 0 && (
                <motion.div
                  key="pending"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-200">Pending</h2>
                    <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-900/20 text-yellow-300 border border-yellow-500/30">
                      {pendingTasks.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <AnimatePresence mode="popLayout">
                      {pendingTasks.map(task => (
                        <SwipeableTaskCard
                          key={task.id}
                          task={task}
                          onComplete={() => handleQuickStatusUpdate(task, 'completed')}
                          onCancel={() => handleQuickStatusUpdate(task, 'cancelled')}
                        >
                          <TaskCard task={task} />
                        </SwipeableTaskCard>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <button
                    onClick={() => setShowCompleted(!showCompleted)}
                    className="flex items-center justify-between w-full group"
                  >
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-200 flex items-center gap-2">
                      Completed
                      {showCompleted ? (
                        <ChevronUp className="h-5 w-5 text-gray-400 group-hover:text-gray-200 transition-colors" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-gray-200 transition-colors" />
                      )}
                    </h2>
                    <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-green-900/20 text-green-300 border border-green-500/30">
                      {completedTasks.length}
                    </span>
                  </button>
                  <AnimatePresence>
                    {showCompleted && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                      >
                        <AnimatePresence mode="popLayout">
                          {completedTasks.map(task => (
                            <TaskCard key={task.id} task={task} />
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Cancelled Tasks */}
              {cancelledTasks.length > 0 && (
                <motion.div
                  key="cancelled"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <button
                    onClick={() => setShowCancelled(!showCancelled)}
                    className="flex items-center justify-between w-full group"
                  >
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-200 flex items-center gap-2">
                      Cancelled
                      {showCancelled ? (
                        <ChevronUp className="h-5 w-5 text-gray-400 group-hover:text-gray-200 transition-colors" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-gray-200 transition-colors" />
                      )}
                    </h2>
                    <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-800/30 text-gray-400 border border-gray-600/30">
                      {cancelledTasks.length}
                    </span>
                  </button>
                  <AnimatePresence>
                    {showCancelled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                      >
                        <AnimatePresence mode="popLayout">
                          {cancelledTasks.map(task => (
                            <TaskCard key={task.id} task={task} />
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {expandedTaskId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ zIndex: 'var(--z-overlay)' }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setExpandedTaskId(null)}
          />
        )}
      </AnimatePresence>

      <TaskEditModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onSave={handleUpdateTask}
      />

      <ConfirmModal
        isOpen={!!deleteConfirmTask}
        onClose={() => setDeleteConfirmTask(null)}
        onConfirm={() => deleteConfirmTask && handleDeleteTask(deleteConfirmTask)}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default TasksPage;