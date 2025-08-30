import { renderHook, act } from '@testing-library/react';
import { useUIState } from '../../hooks/useUIState';

// Mock window.innerWidth and addEventListener/removeEventListener
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  configurable: true,
  value: mockAddEventListener,
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  configurable: true,
  value: mockRemoveEventListener,
});

// Mock document.documentElement.classList
const mockClassList = {
  add: jest.fn(),
  remove: jest.fn(),
};

Object.defineProperty(document, 'documentElement', {
  value: {
    classList: mockClassList,
  },
  writable: true,
});

describe('useUIState Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useUIState());

    expect(result.current.activeTab).toBe('overview');
    expect(result.current.darkMode).toBe(false);
    expect(result.current.isMobile).toBe(false);
    expect(result.current.showMobileMenu).toBe(false);
    expect(result.current.notifications).toEqual([]);
    expect(result.current.error).toBe(null);
    expect(result.current.selectedChart).toBe('budget');
  });

  it('should update active tab correctly', () => {
    const { result } = renderHook(() => useUIState());

    act(() => {
      result.current.setActiveTab('employees');
    });

    expect(result.current.activeTab).toBe('employees');
  });

  it('should toggle dark mode and update document class', () => {
    const { result } = renderHook(() => useUIState());

    act(() => {
      result.current.setDarkMode(true);
    });

    expect(result.current.darkMode).toBe(true);
    expect(mockClassList.add).toHaveBeenCalledWith('dark');

    act(() => {
      result.current.setDarkMode(false);
    });

    expect(result.current.darkMode).toBe(false);
    expect(mockClassList.remove).toHaveBeenCalledWith('dark');
  });

  it('should detect mobile screen size', () => {
    // Set mobile width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    const { result } = renderHook(() => useUIState());

    expect(result.current.isMobile).toBe(true);
  });

  it('should detect desktop screen size', () => {
    // Set desktop width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useUIState());

    expect(result.current.isMobile).toBe(false);
  });

  it('should toggle mobile menu', () => {
    const { result } = renderHook(() => useUIState());

    act(() => {
      result.current.setShowMobileMenu(true);
    });

    expect(result.current.showMobileMenu).toBe(true);

    act(() => {
      result.current.setShowMobileMenu(false);
    });

    expect(result.current.showMobileMenu).toBe(false);
  });

  it('should add and auto-remove notifications', () => {
    const { result } = renderHook(() => useUIState());

    act(() => {
      result.current.showNotification('Test message', 'success');
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      message: 'Test message',
      type: 'success'
    });

    // Fast-forward time to trigger auto-removal
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should add multiple notifications with unique IDs', () => {
    const { result } = renderHook(() => useUIState());

    act(() => {
      result.current.showNotification('First message', 'success');
      result.current.showNotification('Second message', 'error');
    });

    expect(result.current.notifications).toHaveLength(2);
    expect(result.current.notifications[0].id).not.toBe(result.current.notifications[1].id);
  });

  it('should handle error state', () => {
    const { result } = renderHook(() => useUIState());

    const testError = new Error('Test error');

    act(() => {
      result.current.handleError(testError, 'Test Context');
    });

    expect(result.current.error).toMatchObject({
      message: 'Test error',
      context: 'Test Context'
    });
    expect(result.current.error.timestamp).toBeInstanceOf(Date);
  });

  it('should clear error state', () => {
    const { result } = renderHook(() => useUIState());

    act(() => {
      result.current.handleError(new Error('Test error'), 'Test Context');
    });

    expect(result.current.error).not.toBe(null);

    act(() => {
      result.current.setError(null);
    });

    expect(result.current.error).toBe(null);
  });

  it('should update selected chart', () => {
    const { result } = renderHook(() => useUIState());

    act(() => {
      result.current.setSelectedChart('team');
    });

    expect(result.current.selectedChart).toBe('team');
  });

  it('should set up and clean up resize event listener', () => {
    const { unmount } = renderHook(() => useUIState());

    expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should handle resize events', () => {
    const { result } = renderHook(() => useUIState());

    // Get the resize handler
    const resizeHandler = mockAddEventListener.mock.calls.find(
      call => call[0] === 'resize'
    )[1];

    // Simulate resize to mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    act(() => {
      resizeHandler();
    });

    expect(result.current.isMobile).toBe(true);

    // Simulate resize to desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    act(() => {
      resizeHandler();
    });

    expect(result.current.isMobile).toBe(false);
  });

  it('should handle error with default context', () => {
    const { result } = renderHook(() => useUIState());

    const testError = new Error('Test error');

    act(() => {
      result.current.handleError(testError);
    });

    expect(result.current.error).toMatchObject({
      message: 'Test error',
      context: 'Operation'
    });
  });

  it('should handle error without message', () => {
    const { result } = renderHook(() => useUIState());

    const testError = {};

    act(() => {
      result.current.handleError(testError, 'Test Context');
    });

    expect(result.current.error).toMatchObject({
      message: 'An unexpected error occurred',
      context: 'Test Context'
    });
  });

  it('should show notification when handling error', () => {
    const { result } = renderHook(() => useUIState());

    const testError = new Error('Test error');

    act(() => {
      result.current.handleError(testError, 'Test Context');
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      message: 'Test Context failed: Test error',
      type: 'error'
    });
  });

  it('should handle notification with default type', () => {
    const { result } = renderHook(() => useUIState());

    act(() => {
      result.current.showNotification('Test message');
    });

    expect(result.current.notifications[0]).toMatchObject({
      message: 'Test message',
      type: 'success'
    });
  });

  it('should not remove notifications before timeout', () => {
    const { result } = renderHook(() => useUIState());

    act(() => {
      result.current.showNotification('Test message', 'success');
    });

    expect(result.current.notifications).toHaveLength(1);

    // Fast-forward time but not enough to trigger removal
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(result.current.notifications).toHaveLength(1);
  });
});
