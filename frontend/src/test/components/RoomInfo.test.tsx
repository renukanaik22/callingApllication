import { render, screen, fireEvent } from '@testing-library/react';
import { RoomInfo } from '../../components/ui/RoomInfo';
import * as useCopyToClipboardHook from '../../hooks/useCopyToClipboard';

jest.mock('../../hooks/useCopyToClipboard');
const mockUseCopyToClipboard = useCopyToClipboardHook.useCopyToClipboard as jest.MockedFunction<typeof useCopyToClipboardHook.useCopyToClipboard>;

describe('RoomInfo', () => {
  const mockCopyToClipboard = jest.fn();

  beforeEach(() => {
    mockUseCopyToClipboard.mockReturnValue({
      copied: false,
      copyToClipboard: mockCopyToClipboard
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render room ID', () => {
    render(<RoomInfo roomId="test-room-123" />);
    
    expect(screen.getByText('Room: test-room-123')).toBeInTheDocument();
  });

  it('should render copy button', () => {
    render(<RoomInfo roomId="test-room-123" />);
    
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
  });

  it('should call copyToClipboard when button is clicked', () => {
    render(<RoomInfo roomId="test-room-123" />);
    
    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);
    
    expect(mockCopyToClipboard).toHaveBeenCalledWith('test-room-123');
  });

  it('should show "Copied!" when copied is true', () => {
    mockUseCopyToClipboard.mockReturnValue({
      copied: true,
      copyToClipboard: mockCopyToClipboard
    });

    render(<RoomInfo roomId="test-room-123" />);
    
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });

  it('should show "Copy" when copied is false', () => {
    render(<RoomInfo roomId="test-room-123" />);
    
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });
});